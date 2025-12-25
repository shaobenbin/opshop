window.i18nData = {
	zh: {
		new_ws: "新增空间", sync_disk: "同步至磁盘", add_app: "部署应用", add_node: "新增服务器", remove_node: '删除服务器',
		edit: "编辑", confirm: "确认执行", cancel: "放弃",
		tab_basic: "基本配置", tab_health: "心跳监控", tab_adv: "脚本管理",
		f_name: "应用名称", 'f_business_project': "所属业务系统", f_path: "部署目录", f_domain: "外部域名", f_port: "监听端口", f_remarks: "备注",
		f_stdout_log: "应用输出日志目录", f_stderr_log: "应用错误日志目录", f_health_probe_url :'健康检查url', f_health_expect_keyword: '返回关键词匹配', f_manager_script_path: '应用管理脚本',
		node_spec: "节点规格", f_node_name: "服务器名", f_node_ip: "服务器IP地址", f_node_auth_user: '认证用户 (SSH)',
		f_node_cpu_cores: '处理器核心数', f_node_memory: '内存容量', f_node_provider: '云厂商',
		f_expiry: "到期时间", f_owner: "归属组织", f_source_path: '源码仓库/子模块路径', f_lang: "编程语言", f_app_type: "应用类型",
		user_config: "用户账号", confirm_del_node: "确定删除该节点吗？", confirm_del_app: "确定删除应用吗？",
		select_no_project: "没有项目", hint_project_select: '关联后，应用将在主面板中按业务模块进行物理分组。',
		hint_source_path: "建议格式: 仓库名/路径", hint_health_keyword: "用于匹配返回值是包含，如果不填，则仅检查 HTTP 200。",
		hint_manager_script: "脚本需支持参数: ", g_select: "请选择"
	},
	en: {
		new_ws: "NEW_WORKSPACE", sync_disk: "SYNC_DISK", add_app: "ADD_APP", add_node: "ADD_NODE", remove_node: 'REMOVE_NODE',
		edit: "EDIT", confirm: "COMMIT", cancel: "CANCEL",
		tab_basic: "BASIC", tab_health: "HEALTH", tab_adv: "SCRIPTS",
		f_name: "APP_NAME", 'f_business_project': "BUSINESS_PROJECT", f_path: "PATH", f_domain: "DOMAIN", f_port: "LISTEN_PORT", f_remarks: "REMARKS",
		f_stdout_log: "STDOUT_LOG", f_stderr_log: "STDERR_LOG", f_health_probe_url :'HEALTH_PROBE_URL', f_health_expect_keyword: 'EXPECT_KEYWORD', f_manager_script_path: 'MANAGER_SCRIPT_PATH',
		node_spec: "NODE_SPEC", f_node_name: "NODE_NAME", f_node_ip: "IPV4_ADDRESS", f_node_auth_user: 'AUTH_USER (SSH)',
		f_node_cpu_cores: 'CPU_CORES (vCPU)', f_node_memory: 'MEMORY_VOL (RAM)', f_node_provider: 'PROVIDER (INFRA)',
		f_expiry: "EXPIRY", f_owner: "OWNER", f_source_path: 'SOURCE_PATH', f_lang: "LANG", f_app_type: "APP_TYPE",
		user_config: "USER_ACCOUNT", confirm_del_node: "Delete this node?", confirm_del_app: "Delete this app?",
		select_no_project: "NO PROJECT (STANDALONE)", hint_project_select: 'After association, applications will be physically grouped by business modules in the main panel.',
		hint_source_path: "Suggested Format: Repository Name/Path", hint_health_keyword: "To match cases where the return value includes. If left blank, only HTTP 200 will be checked.",
		hint_manager_script: "script must support parameters: ", g_select: "SELECT"
	}
};
