const { createApp } = Vue;

const app = createApp({
	data() {
		return {
			lang: localStorage.getItem('opshop_lang') || 'zh',
			config: { workspaces: [] },
			currentWsId: null,
			editingApp: null,
			editingNode: null,
			editingUser: null,
			currentEditContext: { nodeId: null, userId: null },
			langOptions: ['Java', 'Python', 'Golang', 'Rust', 'PHP', 'Node', 'Html', 'Other'],
			typeOptions: ['api', 'web', 'wap', '独立应用程序', 'web服务应用', '其它'],
		}
	},
	components: {
		'node-card': window.NodeCard,
		'app-modal': window.AppModal,
		'node-modal': window.NodeModal,
		'user-modal': window.UserModal
	},
	methods: {
		/**
		 * 翻译函数
		 * @param {string} key - 翻译键名
		 * @param {boolean} forceEn - 是否强制显示中英对照 (默认 false)
		 */
		t(key, forceEn = false) {
			// 1. 获取英文原始定义 (作为基准或括号内的内容)
			const enVal = (window.i18nData['en'] && window.i18nData['en'][key]) || key;

			// 2. 如果当前设置就是英文，直接返回
			if (this.lang === 'en') {
				return enVal;
			}

			// 3. 获取当前语言翻译 (如中文)
			const curVal = (window.i18nData[this.lang] && window.i18nData[this.lang][key]) || enVal;

			// 4. 判断是否需要显示对照格式
			// 逻辑：要求强制显示对照 && 中文翻译不为空 && 中文和英文不完全一致
			if (forceEn && curVal !== enVal) {
				return `${curVal} (${enVal})`;
			}

			// 5. 默认只返回当前语言翻译
			return curVal;
		},
		setLang(l) { this.lang = l; localStorage.setItem('opshop_lang', l); },
		// 统一的删除全局项方法
		deleteGlobalItem(category, id) {
			const map = { 'project': 'projects', 'lang': 'langs', 'appType': 'app_types', "nodeProvider": 'node_providers' };
			const listName = map[category];
			const list = this.config[listName];

			const index = list.findIndex(item => item.id === id);
			if (index === -1) return;

			const item = list[index];

			// 核心拦截逻辑：系统默认项不允许删除
			if (item.is_default) {
				alert(this.t('err_default_no_delete') || "System default items cannot be deleted!");
				return;
			}

			if (window.confirm(`${this.t('confirm_delete')} [${item.name}]?`)) {
				list.splice(index, 1);
				this.saveConfig();
			}
		},
		// handleCreateGlobalItem 也需要标记新创建的为非默认
		handleCreateGlobalItem({ category, name }, callback) {
			const map = { 'project': 'projects', 'lang': 'langs', 'appType': 'app_types', "nodeProvider": 'node_providers' };
			const listName = map[category];
			if (!this.config[listName]) this.config[listName] = [];

			let item = this.config[listName].find(i => i.name === name);
			if (!item) {
				item = {
					id: Date.now().toString(),
					name: name,
					is_default: false // 用户创建的标记为 false
				};
				this.config[listName].push(item);
				this.saveConfig();
			}
			if (callback) callback(item);
		},
		async loadConfig() {
			const res = await fetch('/api/config');
			const data = await res.json();
			this.config = data && data.workspaces ? data : { workspaces: [] };
			if (this.config.workspaces.length > 0 && !this.currentWsId) {
				this.currentWsId = this.config.workspaces[0].id;
			}
		},
		async saveConfig() {
			await fetch('/api/config', { method: 'POST', body: JSON.stringify(this.config) });
		},

		// 辅助方法：关闭所有弹窗
		closeAllModals() {
			this.editingNode = null;
			this.editingUser = null;
			this.editingApp = null;
		},

		// --- Node 逻辑 ---
		addNode() {
			this.currentWorkspace.nodes.push({
				id: Date.now().toString(), name: "NEW_NODE", ip: "0.0.0.0",
				users: [], cpu: 1, memory: "1G", provider: 'aliyun'
			});
			this.saveConfig();
		},
		editNode(node) {
			this.closeAllModals(); // 先关闭其他的
			this.editingNode = JSON.parse(JSON.stringify(node));
		},
		saveNodeEdit(updatedNode) {
			const idx = this.currentWorkspace.nodes.findIndex(n => n.id === updatedNode.id);
			if (idx !== -1) {
				this.currentWorkspace.nodes[idx] = updatedNode;
				this.editingNode = null;
				this.saveConfig();
			}
		},
		deleteNode(nodeId) {
			const idx = this.currentWorkspace.nodes.findIndex(n => n.id === nodeId);
			if (idx !== -1 && window.confirm(this.t('confirm_del_node'))) {
				this.currentWorkspace.nodes.splice(idx, 1);
				this.saveConfig();
			}
		},

		// --- User 逻辑 (修复 push 报错) ---
		addUser(nodeId) {
			const node = this.currentWorkspace.nodes.find(n => n.id === nodeId);
			if (node) {
				if (!node.users) node.users = []; // 防御性初始化，修复报错
				const newUser = { id: Date.now().toString(), username: 'new-user', password: '', apps: [] };
				node.users.push(newUser);
				this.saveConfig();
			}
		},
		editUser({ nodeId, user }) {
			this.closeAllModals();
			this.currentEditContext.nodeId = nodeId;
			this.editingUser = JSON.parse(JSON.stringify(user));
		},
		saveUserEdit(updatedUser) {
			const node = this.currentWorkspace.nodes.find(n => n.id === this.currentEditContext.nodeId);
			if (node) {
				const idx = node.users.findIndex(u => u.id === updatedUser.id);
				if (idx !== -1) {
					node.users[idx] = updatedUser;
					this.editingUser = null;
					this.saveConfig();
				}
			}
		},
		deleteUser({ nodeId, userId }) {
			const node = this.currentWorkspace.nodes.find(n => n.id === nodeId);
			if (node) {
				const idx = node.users.findIndex(u => u.id === userId);
				if (idx !== -1) {
					node.users.splice(idx, 1);
					this.saveConfig();
				}
			}
		},

		// --- App 逻辑 ---
		addApp({ nodeId, userId }) {
			this.closeAllModals();
			const node = this.currentWorkspace.nodes.find(n => n.id === nodeId);
			const user = node?.users.find(u => u.id === userId);
			if (user) {
				if (!user.apps) user.apps = [];
				user.apps.push({
					id: Date.now().toString(), name: "NEW_APP", deploy_path: "/opt",
					port: 80, project: "SYS", app_type: 'api', lang: 'Java',
					health: {url:"", keyword:""}
				});
				this.saveConfig();
			}
		},
		openAppEditor({ nodeId, userId, app }) {
			this.closeAllModals();
			this.currentEditContext = { nodeId, userId };
			this.editingApp = JSON.parse(JSON.stringify(app));
		},
		saveAppEdit(updatedApp) {
			const node = this.currentWorkspace.nodes.find(n => n.id === this.currentEditContext.nodeId);
			const user = node?.users.find(u => u.id === this.currentEditContext.userId);
			if (user) {
				const idx = user.apps.findIndex(a => a.id === updatedApp.id);
				if (idx !== -1) {
					user.apps[idx] = updatedApp;
					this.editingApp = null;
					this.saveConfig();
				}
			}
		},
		deleteApp({ nodeId, userId, appId }) {
			const node = this.currentWorkspace.nodes.find(n => n.id === nodeId);
			const user = node?.users.find(u => u.id === userId);
			if (user) {
				const idx = user.apps.findIndex(a => a.id === appId);
				if (idx !== -1) {
					user.apps.splice(idx, 1);
					this.saveConfig();
				}
			}
		},
	},
	computed: {
		currentWorkspace() {
			if(!this.config.workspaces) return null;
			return this.config.workspaces.find(ws => ws.id === this.currentWsId);
		}
	},
	mounted() { this.loadConfig(); }
});

app.mount('#app');
