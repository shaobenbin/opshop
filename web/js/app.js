const { createApp } = Vue;

const app = createApp({
	data() {
		return {
			lang: localStorage.getItem('opshop_lang') || 'zh',
			config: { workspaces: [] },
			currentWsId: null,
			editingApp: null,
			editingNode: null
		}
	},
	components: {
		'node-card': window.NodeCard,
		'app-modal': window.AppModal,
		'node-modal': window.NodeModal // 注册新组件
	},
	methods: {
		t(key) { return window.i18nData[this.lang][key] || key; },
		setLang(l) { this.lang = l; localStorage.setItem('opshop_lang', l); },
		async loadConfig() {
			const res = await fetch('/api/config');
			this.config = await res.json();
			if (this.config.workspaces.length > 0 && !this.currentWsId) this.currentWsId = this.config.workspaces[0].id;
		},
		async _saveConfig() {
			await fetch('/api/config', { method: 'POST', body: JSON.stringify(this.config) });
		},
		// 业务逻辑...
		addNode() {
			this.currentWorkspace.nodes.push({ id: Date.now().toString(), name: "NEW_NODE", ip: "0.0.0.0", user: "root", apps: [], cpu: 1, memory: "1G" });
			this._saveConfig();
		},
		editNode(node) {
			this.editingNode = JSON.parse(JSON.stringify(node));
			this._saveConfig();
		},
		deleteNode(nodeId) {
			const idx = this.currentWorkspace.nodes.findIndex(n => n.id === nodeId);
			if (idx !== -1) {
				this.currentWorkspace.nodes.splice(idx, 1);
				this._saveConfig();
			}
		},

		deleteApp({ nodeId, appId }) {
			const node = this.currentWorkspace.nodes.find(n => n.id === nodeId);
			if (node) {
				const appIdx = node.apps.findIndex(a => a.id === appId);
				if (appIdx !== -1) {
					node.apps.splice(appIdx, 1);
					this._saveConfig();
				}
			}
		},
		saveNodeEdit() {
			const idx = this.currentWorkspace.nodes.findIndex(n => n.id === this.editingNode.id);
			this.currentWorkspace.nodes[idx] = this.editingNode;
			this.editingNode = null; this._saveConfig();
		},
		openAppEditor(app) {
			if (!app.health) app.health = { url: "", keyword: "" };
			this.editingApp = JSON.parse(JSON.stringify(app));
		},
		saveAppEdit(updatedApp) {
			this.currentWorkspace.nodes.forEach(node => {
				const idx = node.apps.findIndex(a => a.id === updatedApp.id);
				if (idx !== -1) node.apps[idx] = updatedApp;
			});
			this.editingApp = null;
			this._saveConfig();
		},
		addApp(node) {
			node.apps.push({ id: Date.now().toString(), name: "NEW_APP", deploy_path: "/opt", port: 8080, project: "SYS", health: {url:"", keyword:""} });
			this._saveConfig();
		}
	},
	computed: {
		currentWorkspace() { return this.config.workspaces.find(ws => ws.id === this.currentWsId); }
	},
	mounted() { this.loadConfig(); }
});

app.mount('#app');
