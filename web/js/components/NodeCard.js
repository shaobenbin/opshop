window.NodeCard = {
	props: ['node', 't'],
	components: { 'draggable': window.vuedraggable },
	template: `
    <div class="node-card">
        <!-- 服务器操作区 -->
        <div class="action-group">
            <div class="edit-trigger" @click="$emit('edit-node', node)">[ {{ t('edit') }} ]</div>
            <div class="delete-trigger" @click="confirmDeleteNode">[ {{ t('remove_node') }} ]</div>
        </div>
        <div class="node-header" @dblclick="$emit('edit-node', node)">
            <div class="node-info-main">
                <div style="display:flex; gap:10px; margin-bottom:8px;">
                    <span style="font-size:9px; padding:2px 6px; background:#000; color:var(--neon-blue); border:1px solid var(--neon-blue);">{{ node.owner || 'PRIVATE' }}</span>
                    <span style="font-size:9px; color:#444;">{{ node.provider }}</span>
                </div>
                <div class="node-title">> {{ node.name }}</div>
                <div class="node-specs-row">
                    <span>ADDR: <b>{{ node.ip }}</b></span>
                    <span>USER: <b>{{ node.user }}</b></span>
                    <span>CPU: <b>{{ node.cpu }}C</b></span>
                    <span v-if="node.expiration" style="color:#ff5252">EXP: <b>{{ node.expiration }}</b></span>
                </div>
            </div>
        </div>
        <draggable class="app-list" v-model="node.apps" group="apps" item-key="id" animation="150">
            <template #item="{element}">
                <div class="app-item" @dblclick.stop="$emit('edit-app', element)">
                    <div class="action-group">
                        <div class="edit-trigger" @click.stop="$emit('edit-app', element)">[ E ]</div>
                        <div class="delete-trigger" @click.stop="confirmDeleteApp(element)">[ X ]</div>
                    </div>
                    <div class="app-project">:: {{ element.project || 'SYS' }}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-size:16px; font-weight:bold; color:#fff;">{{ element.name }}</div>
                        <div style="color:var(--neon-green); font-size:13px;">#{{ element.port }}</div>
                    </div>
                    <div class="app-path">PWD: {{ element.deploy_path }}</div>
                </div>
            </template>
        </draggable>
        <div style="padding: 10px 20px 20px;">
            <button class="btn-ghost" @click="$emit('add-app', node)">+ {{ t('add_app') }}</button>
        </div>
    </div>
    `,
	methods: {
		confirmDeleteNode() {
			if (window.confirm(this.t('confirm_del_node') + ` [ ${this.node.name} ] ?`)) {
				this.$emit('delete-node', this.node.id);
			}
		},
		confirmDeleteApp(app) {
			if (window.confirm(this.t('confirm_del_app') + ` [ ${app.name} ] ?`)) {
				this.$emit('delete-app', { nodeId: this.node.id, appId: app.id });
			}
		},
	}
};
