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
		t(key) { return window.i18nData[this.lang][key] || key; },
		setLang(l) { this.lang = l; localStorage.setItem('opshop_lang', l); },
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
		}
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
