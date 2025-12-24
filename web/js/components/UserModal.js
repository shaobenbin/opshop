(function() {
	const css = `
        .modal-box.user-modal { width: 480px; }
        .user-modal-hint { margin-top: 10px; padding: 10px; background: rgba(53, 116, 240, 0.05); border-left: 3px solid var(--jb-blue); font-size: 11px; color: var(--text-dim); }
        .user-modal-hint b { color: var(--jb-blue); }
    `;
	const nmStyle = document.createElement('style');
	nmStyle.innerHTML = css;
	document.head.appendChild(nmStyle);
})();


window.UserModal = {
	props: ['user', 't'],
	template: `
    <div class="modal-mask" @click.self="$emit('close')">
        <div class="modal-box" style="width: 500px;">
            <div class="modal-header">
                <div class="modal-title">{{ t('user_config') }} (USER_ACCOUNT)</div>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>SSH USERNAME (登录用户名) *</label>
                    <input v-model="user.username" placeholder="e.g. root, www, or deploy" autocomplete="off">
                </div>

                <div class="form-group">
                    <label>PASSWORD (登录密码)</label>
                    <input type="password" v-model="user.password" placeholder="Leave empty for SSH Key / Passwordless">
                    <span class="hint">如果不填，系统将尝试使用本地 <b>~/.ssh/id_rsa</b> 进行免密连接。</span>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-primary" style="flex: 1" @click="$emit('save', user)">{{ t('confirm') }}</button>
                <button class="btn" @click="$emit('close')">{{ t('cancel') }}</button>
            </div>
        </div>
    </div>
    `
};
