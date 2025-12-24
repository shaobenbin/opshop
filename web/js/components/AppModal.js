(function() {
	const css = `
        .modal-tabs { display: flex; background: var(--bg-surface); border-bottom: 1px solid var(--border); padding: 0 15px; }
        .tab-btn { padding: 14px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--text-dim); cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 600; outline: none; margin-bottom: -1px; transition: 0.2s; }
        .tab-btn.active { color: var(--jb-blue); border-bottom: 2px solid var(--jb-blue); }
        .tab-btn:hover { color: var(--text-main); }
        .modal-footer { padding: 20px 30px; display: flex; gap: 15px; background: rgba(0,0,0,0.1); border-top: 1px solid var(--border); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .hint { display: block; font-size: 10px; color: var(--text-dim); margin-top: 6px; }
    `;
	const appStyle = document.createElement('style');
	appStyle.innerHTML = css;
	document.head.appendChild(appStyle);
})();

window.AppModal = {
	props: ['app', 't', 'langOptions', 'typeOptions'],
	data() {
		return { activeTab: 1 };
	},
	computed: {
		showPort() {
			return ['api', 'web服务应用', '其它'].includes(this.app.app_type);
		},
		showLogs() {
			return ['api', '独立应用程序', 'web服务应用', '其它'].includes(this.app.app_type);
		}
	},
	template: `
    <div class="modal-mask" @click.self="$emit('close')">
        <div class="modal-box">
            <div class="modal-tabs">
				<button :class="['tab-btn', activeTab === 1 ? 'active' : '']" @click="activeTab = 1">
					{{ t('tab_basic') }}
				</button>
				<button :class="['tab-btn', activeTab === 2 ? 'active' : '']" @click="activeTab = 2">
					{{ t('tab_health') }}
				</button>
				<button :class="['tab-btn', activeTab === 3 ? 'active' : '']" @click="activeTab = 3">
					{{ t('tab_adv') }}
				</button>
			</div>
            <div class="modal-body">
                <div v-show="activeTab === 1">
                    <div class="form-group">
                        <label>{{ t('f_name') }} (NAME) *</label>
                        <input v-model="app.name" spellcheck="false" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label>DEPLOY_PATH (部署目录)</label>
                        <input v-model="app.deploy_path" placeholder="/home/server/app/...">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>LANGUAGE</label>
                            <select v-model="app.lang">
                                <option value="">-- SELECT --</option>
                                <option v-for="l in langOptions" :key="l" :value="l">{{ l }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>TYPE</label>
                            <select v-model="app.app_type">
                                <option value="">-- SELECT --</option>
                                <option v-for="tp in typeOptions" :key="tp" :value="tp">{{ tp }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" v-if="showPort">
                        <label>{{ t('f_port') }}</label>
                        <input type="number" v-model.number="app.port">
                    </div>
                    <div class="form-row" v-if="showLogs">
                        <div class="form-group">
                            <label>STDOUT_LOG</label>
                            <input v-model="app.out_log_path" placeholder="logs/out.log">
                        </div>
                        <div class="form-group">
                            <label>STDERR_LOG</label>
                            <input v-model="app.err_log_path" placeholder="logs/err.log">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>{{ t('f_domain') }}</label>
                        <input v-model="app.domain">
                    </div>
                    <div class="form-group">
                        <label>PROJECT</label>
                        <input v-model="app.project">
                    </div>
                    <div class="form-group"><label>{{ t('f_remarks') }}</label><textarea v-model="app.remarks" rows="2"></textarea></div>
                </div>
                <div v-show="activeTab === 2">
                    <div class="form-group"><label>PROBE_URL</label><input v-model="app.health.url"></div>
                    <div class="form-group"><label>KEYWORD</label><input v-model="app.health.keyword"></div>
                </div>
                <div v-show="activeTab === 3">
                    <div class="form-group"><label>MANAGER_SCRIPT (sh)</label><input v-model="app.manager_script"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" style="flex:1" @click="$emit('save', app)">{{ t('confirm') }}</button>
                <button class="btn" @click="$emit('close')">{{ t('cancel') }}</button>
            </div>
        </div>
    </div>
    `
};
