window.AppModal = {
	props: ['app', 't'],
	data() {
		return { activeTab: 1 };
	},
	template: `
    <div class="modal-mask" @click.self="$emit('close')">
        <div class="modal-box">
            <div class="modal-tabs">
                <button :class="['tab-btn', activeTab === 1 ? 'active' : '']" @click="activeTab = 1">{{ t('tab_basic') }}</button>
                <button :class="['tab-btn', activeTab === 2 ? 'active' : '']" @click="activeTab = 2">{{ t('tab_health') }}</button>
                <button :class="['tab-btn', activeTab === 3 ? 'active' : '']" @click="activeTab = 3">{{ t('tab_adv') }}</button>
            </div>
            <div class="modal-body">
                <div v-show="activeTab === 1">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                        <div class="form-group"><label>{{ t('f_name') }}</label><input v-model="app.name" spellcheck="false"></div>
                        <div class="form-group"><label>PROJECT</label><input v-model="app.project" spellcheck="false"></div>
                    </div>
                    <div class="form-group"><label>{{ t('f_path') }}</label><input v-model="app.deploy_path"></div>
                    <div class="form-group"><label>{{ t('f_domain') }}</label><input v-model="app.domain"></div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                        <div class="form-group"><label>LANG</label><input v-model="app.lang"></div>
                        <div class="form-group"><label>{{ t('f_port') }}</label><input type="number" v-model.number="app.port"></div>
                    </div>
                    <div class="form-group"><label>{{ t('f_remarks') }}</label><textarea v-model="app.remarks" rows="2"></textarea></div>
                </div>
                <div v-show="activeTab === 2">
                    <div class="form-group"><label>PROBE_URL</label><input v-model="app.health.url"></div>
                    <div class="form-group"><label>KEYWORD</label><input v-model="app.health.keyword"></div>
                </div>
                <div v-show="activeTab === 3">
                    <div class="form-group"><label>MANAGER_SCRIPT (start|stop|restart)</label><input v-model="app.manager_script"></div>
                </div>
            </div>
            <div style="padding:20px 35px; display:flex; gap:15px; background:rgba(0,0,0,0.2);">
                <button class="btn-primary" style="flex:1" @click="$emit('save', app)">{{ t('confirm') }}</button>
                <button class="btn" @click="$emit('close')">{{ t('cancel') }}</button>
            </div>
        </div>
    </div>
    `
};
