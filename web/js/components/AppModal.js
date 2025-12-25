(function() {
	const css = `
        /* 侧边栏抽屉动画与基础布局 */
        .modal-box.app-drawer {
            width: 600px;
            height: 100vh;
            position: fixed;
            right: 0; top: 0;
            background: var(--bg-surface);
            border-left: 1px solid var(--border);
            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
            display: flex; flex-direction: column;
            animation: drawerIn 0.3s ease-out;
        }

        @keyframes drawerIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }

        /* JB 风格 Tabs */
        .modal-tabs {
            display: flex; background: var(--bg-surface);
            border-bottom: 1px solid var(--border); padding: 0 15px;
        }
        .tab-btn {
            padding: 14px 20px; background: transparent; border: none;
            border-bottom: 2px solid transparent; color: var(--text-dim);
            cursor: pointer; font-family: inherit; font-size: 12px;
            font-weight: 600; outline: none; margin-bottom: -1px; transition: 0.2s;
        }
        .tab-btn.active { color: var(--jb-blue); border-bottom: 2px solid var(--jb-blue); }
        .tab-btn:hover { color: var(--text-main); }

        /* 内容区布局 */
        .modal-body { flex: 1; padding: 30px; overflow-y: auto; background: var(--bg-deep); }
        .modal-footer { padding: 20px 30px; display: flex; gap: 15px; background: var(--bg-surface); border-top: 1px solid var(--border); }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .select-add-row { display: flex; gap: 8px; align-items: flex-start; }

        .hint { display: block; font-size: 10px; color: var(--text-dim); margin-top: 6px; line-height: 1.4; }
        .hint b { color: var(--jb-blue); }

        select option { background: var(--bg-surface); color: var(--text-main); }
    `;
	const appStyle = document.createElement('style');
	appStyle.innerHTML = css;
	document.head.appendChild(appStyle);
})();

window.AppModal = {
	// 接收全局实体库
	props: ['app', 't', 'allProjects', 'allLangs', 'allAppTypes'],
	data() {
		return {
			activeTab: 1
		};
	},
	computed: {
		// 根据已选类型的 Name 判断是否显示端口 (因为 ID 是动态生成的，用 Name 判断更稳健)
		currentTypeName() {
			const type = this.allAppTypes.find(t => t.id === this.app.app_type_id);
			return type ? type.name.toLowerCase() : '';
		},
		showPort() {
			return ['api', 'web服务应用', '其它'].includes(this.currentTypeName);
		},
		showLogs() {
			// 绝大多数后端应用需要配置日志
			const typesWithLogs = ['api', '独立应用程序', 'web服务应用', '其它'];
			return typesWithLogs.includes(this.currentTypeName);
		}
	},
	methods: {
		// 通用创建方法：category 为 'project' | 'lang' | 'type'
		promptNewItem(category) {
			const titles = { 'project': 'BUSINESS_PROJECT', 'lang': 'LANGUAGE', 'appType': 'APP_TYPE' };
			const name = prompt(`ENTER NEW ${titles[category]} NAME:`);

			if (name && name.trim()) {
				// 向根组件 emit 事件，并传入回调函数以获取新生成的 ID
				this.$emit('create-global-item', { category, name: name.trim() }, (newItem) => {
					if (category === 'project') this.app.project_id = newItem.id;
					if (category === 'lang') this.app.lang_id = newItem.id;
					if (category === 'appType') this.app.app_type_id = newItem.id;
				});
			}
		}
	},
	template: `
    <div class="modal-mask" @click.self="$emit('close')">
        <div class="modal-box app-drawer">
            <!-- 头部 Tab 导航 -->
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
                <!-- TAB 1: 基本配置 (BASIC CONFIG) -->
                <div v-show="activeTab === 1">
                    <!-- 应用标识 -->
                    <div class="form-group">
                        <label>{{ t('f_name', true) }} *</label>
                        <input v-model="app.name" spellcheck="false" autocomplete="off" placeholder="e.g. 分销系统-API">
                    </div>

                    <!-- 业务项目关联 -->
                    <div class="form-group">
                        <label>{{ t('f_business_project', true) }}</label>
                        <div class="select-add-row">
                            <select v-model="app.project_id">
                                <option value="">-- {{ t('select_no_project') }} --</option>
                                <option v-for="p in allProjects" :key="p.id" :value="p.id">
                                    {{ p.name }}
                                </option>
                            </select>
                            <button class="btn" type="button" @click="promptNewItem('project')">+</button>
                        </div>
                        <span class="hint">{{ t('hint_project_select') }}</span>
                    </div>

                    <!-- 部署路径 -->
                    <div class="form-group">
                        <label>{{ t('f_path', true) }} </label>
                        <input v-model="app.deploy_path" placeholder="/home/server/app/...">
                    </div>

                    <!-- 源码追溯 -->
                    <div class="form-group">
                        <label>{{ t('f_source_path', true) }}</label>
                        <input v-model="app.source_path" placeholder="e.g. opshop/rest/api">
                        <span class="hint">{{ t('hint_source_path') }}</span>
                    </div>

                    <!-- 外部域名 -->
                    <div class="form-group">
                        <label>{{ t('f_domain', true) }}</label>
                        <input v-model="app.domain" placeholder="api.taobit.cn">
                    </div>

                    <!-- 语言与类型选择 -->
                    <div class="form-row">
                        <div class="form-group">
                            <label>{{ t('f_lang', true) }}</label>
                            <div class="select-add-row">
                                <select v-model="app.lang_id">
                                    <option value="">-- {{ t('g_select') }} --</option>
                                    <option v-for="l in allLangs" :key="l.id" :value="l.id">
                                        {{ l.name }} {{ l.is_default ? '•' : '' }}
                                    </option>
                                </select>
                                <button class="btn" type="button" @click="promptNewItem('lang')">+</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>{{ t('f_app_type', true) }}</label>
                            <div class="select-add-row">
                                <select v-model="app.app_type_id">
                                    <option value="">-- {{ t('g_select') }} --</option>
                                    <option v-for="tp in allAppTypes" :key="tp.id" :value="tp.id">
                                        {{ tp.name }} {{ tp.is_default ? '•' : '' }}
                                    </option>
                                </select>
                                <button class="btn" type="button" @click="promptNewItem('appType')">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- 内部端口 (动态) -->
                    <div class="form-group" v-if="showPort">
                        <label>{{ t('f_port', true) }}</label>
                        <input type="number" v-model.number="app.port" placeholder="8080">
                    </div>

                    <!-- 日志路径 (动态) -->
                    <div class="form-row" v-if="showLogs">
                        <div class="form-group">
                            <label>{{ t('f_stdout_log', true) }}</label>
                            <input v-model="app.out_log_path" placeholder="logs/console.log">
                        </div>
                        <div class="form-group">
                            <label>{{ t('f_stderr_log', true) }}</label>
                            <input v-model="app.err_log_path" placeholder="logs/error.log">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>{{ t('f_remarks', true) }}</label>
                        <textarea v-model="app.remarks" rows="2" placeholder="Deployment notes..."></textarea>
                    </div>
                </div>

                <!-- TAB 2: 健康检查 (HEALTH MONITOR) -->
                <div v-show="activeTab === 2">
                    <div class="form-group">
                        <label>{{ t('f_health_probe_url', true) }}</label>
                        <input v-model="app.health.url" placeholder="https://127.0.0.1:port/health">
                    </div>
                    <div class="form-group">
                        <label>{{ t('f_health_expect_keyword', true) }} </label>
                        <input v-model="app.health.keyword" placeholder="e.g. success">
                        <span class="hint">{{ t('hint_health_keyword') }}</span>
                    </div>
                </div>

                <!-- TAB 3: 高级管理 (SCRIPTS) -->
                <div v-show="activeTab === 3">
                    <div class="form-group">
                        <label>{{ t('f_manager_script_path', true) }}</label>
                        <input v-model="app.manager_script" placeholder="scripts/manager.sh">
                        <span class="hint">{{ t('hint_manager_script') }} <b>start | stop | restart | status</b></span>
                    </div>
                </div>
            </div>

            <!-- 底部操作区 (FOOTER) -->
            <div class="modal-footer">
                <button class="btn-primary" style="flex: 1" @click="$emit('save', app)">
                    {{ t('confirm') }}
                </button>
                <button class="btn" @click="$emit('close')">
                    {{ t('cancel') }}
                </button>
            </div>
        </div>
    </div>
    `
};
