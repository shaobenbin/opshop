window.NodeModal = {
	props: ['node', 't'],
	template: `
    <div class="modal-mask" @click.self="$emit('close')">
        <div class="modal-box" style="width: 580px;">
            <div class="modal-header">
                <div class="modal-title">{{ t('node_spec') }}</div>
            </div>

            <div class="modal-body">
                <!-- 服务器基本标识 -->
                <div class="form-group">
                    <label>{{ t('f_node_name') }} (NODE_NAME)</label>
                    <input v-model="node.name" placeholder="e.g. prod-web-01" autocomplete="off">
                </div>

                <div class="form-row">
                    <!-- IP 地址 -->
                    <div class="form-group">
                        <label>IPV4_ADDRESS</label>
                        <input v-model="node.ip" placeholder="10.0.0.1" autocomplete="off">
                    </div>
                    <!-- 登录用户 -->
                    <div class="form-group">
                        <label>AUTH_USER (SSH)</label>
                        <input v-model="node.user" placeholder="root" autocomplete="off">
                    </div>
                </div>

                <div class="form-row">
                    <!-- CPU 规格 -->
                    <div class="form-group">
                        <label>CPU_CORES (vCPU)</label>
                        <input type="number" v-model.number="node.cpu" placeholder="2">
                    </div>
                    <!-- 内存规格 -->
                    <div class="form-group">
                        <label>MEMORY_VOL (RAM)</label>
                        <input v-model="node.memory" placeholder="4G">
                    </div>
                </div>

                <div class="form-row">
                    <!-- 云厂商 -->
                    <div class="form-group">
                        <label>PROVIDER (INFRA)</label>
                        <select v-model="node.provider">
                            <option value="aliyun">Aliyun (阿里云)</option>
                            <option value="tencent">Tencent (腾讯云)</option>
                            <option value="huawei">Huawei (华为云)</option>
                            <option value="local">Local (自建/其他)</option>
                        </select>
                    </div>
                    <!-- 到期时间 -->
                    <div class="form-group">
                        <label>{{ t('f_expiry') }} (EXPIRATION)</label>
                        <input type="date" v-model="node.expiration">
                    </div>
                </div>

                <div class="form-group">
                    <!-- 归属权 -->
                    <label>{{ t('f_owner') }} (OWNERSHIP)</label>
                    <input v-model="node.owner" placeholder="e.g. 研发部 / A项目组" autocomplete="off">
                </div>

                <div class="form-group">
                    <!-- 备注 -->
                    <label>{{ t('f_remarks') }} (REMARKS)</label>
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
