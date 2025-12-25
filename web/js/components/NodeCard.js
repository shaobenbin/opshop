(function() {
	const css = `
        .node-card {
            background: var(--bg-surface); border: 1px solid var(--border);
            border-radius: 8px; position: relative; margin-bottom: 35px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column;
        }

        /* --- 服务器头部 --- */
        .node-header {
            padding: 25px; background: rgba(255,255,255,0.02);
            border-bottom: 1px solid var(--border); position: relative; padding-right: 150px;
        }
        .node-title-row { display: flex; align-items: baseline; gap: 12px; margin-top: 5px; }
        .node-title-text { font-size: 20px; font-weight: bold; color: var(--text-main); }
        .node-ip-text { font-size: 14px; color: var(--jb-blue); font-family: monospace; opacity: 0.8; }
        .node-specs-row { display: flex; gap: 15px; font-size: 11px; color: var(--text-dim); margin-top: 10px; }
        .node-specs-row span b { color: #aaa; font-weight: normal; }

        /* --- 到期时间 --- */
        .expiry-label { font-size: 11px; font-weight: 600; padding: 2px 0; }
        .expiry-normal { color: var(--jb-green); }
        .expiry-warning { color: var(--jb-orange); }
        .expiry-urgent { color: var(--jb-red); font-weight: bold; }
        .expiry-expired { color: var(--text-dim); text-decoration: line-through; opacity: 0.6; }

        /* --- 用户区块 --- */
        .user-section { margin: 15px 25px; background: #232428; border: 1px solid #323235; border-radius: 6px; overflow: hidden; }
        .user-header {
            padding: 14px 18px; background: #2b2d30;
            border-bottom: 1px solid #323235; display: flex;
            justify-content: space-between; align-items: center;
            border-left: 4px solid var(--jb-orange);
        }
        .username-text { font-size: 16px; font-weight: bold; color: var(--text-main); }
        .badge-auth-subtle { font-size: 9px; padding: 1px 4px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.1); color: var(--text-dim); background: rgba(0,0,0,0.2); }

        /* --- 业务项目分组盒子 (新) --- */
        .project-group-box {
            margin: 25px 18px 15px;
            border: 1px solid #414245;
            border-radius: 4px;
            position: relative;
            background: rgba(0,0,0,0.1);
        }
        .project-group-label {
            position: absolute;
            top: -11px; left: 12px;
            background: #232428; /* 与 user-section 背景一致 */
            padding: 0 10px;
            font-size: 11px;
            font-weight: bold;
            color: var(--jb-orange);
            border: 1px solid #414245;
            border-radius: 3px;
            text-transform: uppercase;
        }

        /* --- 应用列表布局 --- */
        .app-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 18px; }
        .app-item {
            background: #18191c; border: 1px solid #2d2f33; padding: 16px; border-radius: 6px;
            cursor: grab; position: relative; border-left: 3px solid var(--jb-green); transition: 0.2s;
        }
        .app-item:hover { border-color: var(--jb-green); background: #1e2024; transform: translateX(2px); }

        .app-tab-group { display: flex; gap: 2px; margin-bottom: 8px; }
        .app-tab { font-size: 9px; font-weight: bold; padding: 1px 6px; border-radius: 2px; text-transform: uppercase; }
        .app-tab.lang { background: #2d332d; color: var(--jb-green); border: 1px solid rgba(89,168,105,0.3); }
        .app-tab.type { background: #232a24; color: #889d8b; border: 1px solid rgba(89,168,105,0.1); }

        .app-title { font-size: 15px; font-weight: bold; color: #fff; }
        .app-port { color: var(--jb-green); font-size: 12px; font-family: monospace; }
        .app-source-path { font-size: 10px; color: var(--jb-purple); margin-top: 8px; font-family: monospace; opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .app-path { font-size: 11px; color: #6a8759; margin-top: 6px; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* --- 按钮与操作 --- */
        .btn-add-app { width: 100%; border: 1px dashed var(--jb-green); color: var(--jb-green); background: rgba(89, 168, 105, 0.03); padding: 8px; cursor: pointer; border-radius: 4px; font-size: 11px; font-weight: 600; font-family: inherit;}
        .btn-add-user { width: 100%; border: 1px solid var(--jb-blue); color: var(--jb-blue); background: transparent; padding: 10px; cursor: pointer; border-radius: 4px; font-size: 12px; font-weight: bold; font-family: inherit;}

        .action-group { position: absolute; right: 12px; top: 12px; display: flex; gap: 6px; opacity: 0; transition: 0.15s; z-index: 50; }
        .node-card:hover > .action-group, .user-header:hover .action-group, .app-item:hover .action-group { opacity: 1; }
        .edit-trigger, .delete-trigger { background: #1e1f22; border: 1px solid var(--border); padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: bold; }
        .edit-trigger { color: var(--jb-blue); }
        .delete-trigger { color: var(--jb-red); }

        .node-meta-tabs { display: flex; gap: 2px; }
        .meta-tab { font-size: 10px; font-weight: bold; padding: 2px 8px; background: #393b40; color: var(--text-dim); border-radius: 2px; text-transform: uppercase; }
        .meta-tab.owner { background: #354a6e; color: #a5d8ff; }
    `;
	const styleTag = document.createElement('style');
	styleTag.innerHTML = css;
	document.head.appendChild(styleTag);
})();

window.NodeCard = {
	props: ['node', 't', 'allProjects', 'allLangs', 'allAppTypes', 'allNodeProviders'],
	components: { 'draggable': window.vuedraggable },
	methods: {
		getExpiryStatus(dateStr) {
			if (!dateStr) return { class: 'expiry-normal', text: 'EXP' };
			const exp = new Date(dateStr);
			const now = new Date();
			const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
			if (diffDays < 0) return { class: 'expiry-expired', text: 'EXPIRED' };
			if (diffDays < 7) return { class: 'expiry-urgent', text: 'URGENT' };
			if (diffDays < 30) return { class: 'expiry-warning', text: 'RENEW' };
			return { class: 'expiry-normal', text: 'EXP' };
		},
		// 将应用按照 ProjectID 分组
		getGroupedApps(apps) {
			const groups = { standalone: [] };
			if (!apps) return groups;
			apps.forEach(app => {
				if (app.project_id) {
					if (!groups[app.project_id]) groups[app.project_id] = [];
					groups[app.project_id].push(app);
				} else {
					groups.standalone.push(app);
				}
			});
			return groups;
		},
		getNodeProviderName(providerId) {
			const nodeProvider = (this.allNodeProviders || []).find(p => p.id === providerId);
			return nodeProvider ? nodeProvider.name : '';
		},
		getProjectName(pid) {
			const proj = (this.allProjects || []).find(p => p.id === pid);
			return proj ? proj.name : 'UNKNOWN PROJECT';
		},
		getLangName(langId) {
			const lang = (this.allLangs || []).find(l => l.id === langId);
			return lang ? lang.name : '';
		},
		getAppTypeName(typeId) {
			const appType = (this.allAppTypes || []).find(at => at.id === typeId);
			return appType ? appType.name : '';
		},
		confirmDeleteNode() { if (window.confirm(this.t('confirm_del_node'))) this.$emit('delete-node', this.node.id); },
		confirmDeleteUser(user) { if (window.confirm(`Delete User [${user.username}]?`)) this.$emit('delete-user', {nodeId: this.node.id, userId: user.id}); },
		confirmDeleteApp(user, app) { if (window.confirm(this.t('confirm_del_app'))) this.$emit('delete-app', { nodeId: this.node.id, userId: user.id, appId: app.id }); }
	},
	template: `
    <div class="node-card">
        <div class="action-group">
            <div class="edit-trigger" @click="$emit('edit-node', node)">[ {{ t('edit') }} ]</div>
            <div class="delete-trigger" @click="confirmDeleteNode">[ {{ t('remove_node') }} ]</div>
        </div>

        <div class="node-header" @dblclick="$emit('edit-node', node)">
            <div class="node-info-main">
                <div class="node-meta-tabs">
                    <div class="meta-tab owner">{{ node.owner || 'PRIVATE' }}</div>
                    <div v-if="node.provider_id" class="meta-tab provider">{{ getNodeProviderName(node.provider_id) }}</div>
                </div>
                <div class="node-title-row">
                    <span class="node-title-text">🖥️ {{ node.name }}</span>
                    <span class="node-ip-text">{{ node.ip }}</span>
                </div>
                <div class="node-specs-row">
                    <span>CPU: <b>{{ node.cpu || 1 }}C</b></span>
                    <span>MEM: <b>{{ node.memory || '1G' }}</b></span>
                    <span v-if="node.expiration" :class="['expiry-label', getExpiryStatus(node.expiration).class]">
                        📅 {{ getExpiryStatus(node.expiration).text }}: {{ node.expiration }}
                    </span>
                </div>
            </div>
        </div>

        <div v-for="user in node.users" :key="user.id" class="user-section">
            <div class="user-header">
                <div class="user-info">
                    <span class="username-text">👤 {{ user.username }}</span>
                    <span :class="['badge-auth-subtle']">{{ user.password ? 'PWD_AUTH' : 'SSH_KEY' }}</span>
                </div>
                <div class="action-group" style="position: relative; top: 0; right: 0; opacity: 1;">
                    <div class="edit-trigger" @click="$emit('edit-user', {nodeId: node.id, user})">EDIT</div>
                    <div class="delete-trigger" @click="confirmDeleteUser(user)">DEL</div>
                </div>
            </div>

            <!-- 应用展示区：按项目分组 -->
            <div class="user-apps-container">
                <!-- A. 渲染有项目分组的应用 -->
                <div v-for="(apps, pid) in getGroupedApps(user.apps)" :key="pid">
                    <div v-if="pid !== 'standalone'" class="project-group-box">
                        <div class="project-group-label">{{ getProjectName(pid) }}</div>
                        <draggable class="app-list" v-model="user.apps" :list="apps" group="apps" item-key="id" animation="150" @change="$emit('save-config')">
                            <template #item="{element}">
                                <div class="app-item" @dblclick.stop="$emit('edit-app', {nodeId: node.id, userId: user.id, app: element})">
                                    <div class="action-group">
                                        <div class="edit-trigger" @click.stop="$emit('edit-app', {nodeId: node.id, userId: user.id, app: element})">E</div>
                                        <div class="delete-trigger" @click.stop="confirmDeleteApp(user, element)">X</div>
                                    </div>
                                    <div class="app-tab-group">
                                        <span v-if="element.lang_id" class="app-tab lang">{{ getLangName(element.lang_id) }}</span>
                                        <span v-if="element.app_type_id" class="app-tab type">{{ getAppTypeName(element.app_type_id) }}</span>
                                    </div>
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div class="app-title">{{ element.name }}</div>
                                        <div v-if="element.port" class="app-port">#{{ element.port }}</div>
                                    </div>
                                    <div v-if="element.source_path" class="app-source-path">🌿 {{ element.source_path }}</div>
                                    <div v-if="element.deploy_path" class="app-path">📍 {{ element.deploy_path }}</div>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>

                <!-- B. 渲染无项目分组的应用 (Standalone) -->
                <draggable class="app-list" :list="getGroupedApps(user.apps).standalone" group="apps" item-key="id" animation="150" @change="$emit('save-config')">
                    <template #item="{element}">
                        <div class="app-item" @dblclick.stop="$emit('edit-app', {nodeId: node.id, userId: user.id, app: element})">
                            <div class="action-group">
                                <div class="edit-trigger" @click.stop="$emit('edit-app', {nodeId: node.id, userId: user.id, app: element})">E</div>
                                <div class="delete-trigger" @click.stop="confirmDeleteApp(user, element)">X</div>
                            </div>
                            <div class="app-tab-group">
                                <span v-if="element.lang_id" class="app-tab lang">{{ getLangName(element.lang_id) }}</span>
                                <span v-if="element.app_type_id" class="app-tab type">{{ getAppTypeName(element.app_type) }}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="app-title">{{ element.name }}</div>
                                <div v-if="element.port" class="app-port">#{{ element.port }}</div>
                            </div>
                            <div v-if="element.source_path" class="app-source-path">🌿 {{ element.source_path }}</div>
                            <div v-if="element.deploy_path" class="app-path">📍 {{ element.deploy_path }}</div>
                        </div>
                    </template>
                </draggable>
            </div>

            <div class="user-footer">
                <button class="btn-add-app" @click="$emit('add-app', {nodeId: node.id, userId: user.id})">+ {{ t('add_app') }}</button>
            </div>
        </div>

        <div class="card-footer">
            <button class="btn-add-user" @click="$emit('add-user', node.id)">+ ADD USER ACCOUNT</button>
        </div>
    </div>
    `
};
