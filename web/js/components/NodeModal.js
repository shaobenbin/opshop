(function() {
	const css = `
        .nm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8); cursor: pointer; }
        .select-add-row { display: flex; gap: 8px; align-items: flex-start; }
    `;
	const nmStyle = document.createElement('style');
	nmStyle.innerHTML = css;
	document.head.appendChild(nmStyle);
})();

window.NodeModal = {
	props: ['node', 't', 'allNodeProviders'],
	methods: {
		// 通用创建方法：category 为 'project' | 'lang' | 'type'
		promptNewItem(category) {
			const name = prompt(`ENTER NEW NODE PROVIDER NAME:`);

			if (name && name.trim()) {
				// 向根组件 emit 事件，并传入回调函数以获取新生成的 ID
				this.$emit('create-global-item', { category, name: name.trim() }, (newItem) => {
					this.node.provider_id = newItem.id;
				});
			}
		}
	},
	template: `
    <div class="modal-mask" @click.self="$emit('close')">
        <div class="modal-box" style="width: 580px;">
            <div class="modal-header">
                <div class="modal-title">{{ t('node_spec') }}</div>
            </div>

            <div class="modal-body">
                <!-- 服务器基本标识 -->
                <div class="form-group">
                    <label>{{ t('f_node_name', true) }}</label>
                    <input v-model="node.name" placeholder="e.g. prod-web-01" autocomplete="off">
                </div>

                <div class="form-row">
                    <!-- IP 地址 -->
                    <div class="form-group">
                        <label>{{ t('f_node_ip', true) }}</label>
                        <input v-model="node.ip" placeholder="10.0.0.1" autocomplete="off">
                    </div>
                    <div class="form-group">
						<!-- 归属权 -->
						<label>{{ t('f_owner', true) }}</label>
						<input v-model="node.owner" placeholder="e.g. 研发部 / A项目组" autocomplete="off">
                    </div>
                </div>

                <div class="form-row">
                    <!-- CPU 规格 -->
                    <div class="form-group">
                        <label>{{ t('f_node_cpu_cores', true) }}</label>
                        <input type="number" v-model.number="node.cpu" placeholder="2">
                    </div>
                    <!-- 内存规格 -->
                    <div class="form-group">
                        <label>{{ t('f_node_memory', true) }}</label>
                        <input v-model="node.memory" placeholder="4G">
                    </div>
                </div>

                <div class="form-row">
                    <!-- 云厂商 -->
                    <div class="form-group">
                        <label>{{ t('f_node_provider', true) }}</label>
						<div class="select-add-row">
							<select v-model="node.provider_id">
								<option value="">-- {{ t('g_select') }} --</option>
								<option v-for="l in allNodeProviders" :key="l.id" :value="l.id">
									{{ l.name }} {{ l.is_default ? '•' : '' }}
								</option>
							</select>

							<button class="btn" type="button" @click="promptNewItem('appType')">+</button>
						</div>
                    </div>
                    <!-- 到期时间 -->
                    <div class="form-group">
                        <label>{{ t('f_expiry', true) }}</label>
                        <input type="date" v-model="node.expiration">
                    </div>
                </div>

                <div class="form-group">
                    <!-- 备注 -->
                    <label>{{ t('f_remarks', true) }}</label>
                    <textarea v-model="node.remarks" rows="3" placeholder="Additional notes..."></textarea>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-primary" style="flex: 1" @click="$emit('save', node)">{{ t('confirm') }}</button>
                <button class="btn" @click="$emit('close')">{{ t('cancel') }}</button>
            </div>
        </div>
    </div>
    `
};
