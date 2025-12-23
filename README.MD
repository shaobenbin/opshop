# OpsHop // 研发资产枢纽

> **A Productivity Tool for Developers & R&D Leads.**
> 拒绝在笔记中翻找 IP，拒绝复杂的堡垒机。一键直达应用目录，可视化管理服务器资产。

`OpsHop` 是一个专为独立开发者和研发主管设计的 **轻量级服务器与应用资产管理工具**。它结合了 **JetBrains 风格的可视化 Web 面板** 与 **高效的 Golang 命令行工具**，旨在通过“配置即代码”的逻辑，彻底解决多项目、多服务器环境下的管理混乱。

---

## 🚀 核心特性 // Features

### 1. 极致的连接体验 (Smart Connect)
- **模糊匹配**：只需输入应用名片段（如 `opshop eagle`），即可智能定位目标。
- **上下文感知**：连接应用时，自动执行 `cd` 指令，光标直达部署目录。
- **多重选择**：当关键词匹配多个目标时，提供交互式编号列表进行选择。
- **运维指令**：支持 `opshop <name> logs` 或 `opshop <name> restart` 等扩展指令。

### 2. JetBrains 风格管理面板 (Visual Dashboard)
- **资产看板**：一行一服务器（Node），每行两应用（App）的矩阵布局，信息密度极高。
- **隐身 UI**：编辑与删除按钮仅在悬停时出现，保持界面如监控大屏般纯净。
- **拖拽关联**：支持跨服务器拖拽应用，快速完成资产的重新分配。
- **多维度管理**：内置云厂商（Aliyun/Tencent）、归属公司（Owner）、规格、到期日等核心字段。

### 3. 100% 离线与隐私 (Private & Offline)
- **无数据库设计**：所有数据持久化为本地 `~/.opshop/config.yaml`，方便 Git 备份。
- **静态资源内嵌**：使用 `go:embed` 技术，Vue/Sortable 等库全部封装在二进制文件中，无需网络即可使用。
- **多语言支持**：原生支持 中文 (ZH_CN) / 英文 (EN_US) 一键切换。

---

## 🛠️ 安装说明 // Installation

### 方式一：Homebrew (推荐)
```bash
brew tap yourname/tap
brew install opshop
```

### 方式二：手动编译
```bash
git clone https://github.com/shaobenbin/opshop.git
cd opshop
go build -o opshop *.go
mv opshop /usr/local/bin/
```

---

## 📖 命令行手册 // CLI Usage

| 指令 | 说明                                       |
| :--- |:-----------------------------------------|
| `opshop ui` | 启动 Web 管理面板 (默认: http://127.0.0.1:18181) |
| `opshop <name>` | 搜索目标并建立 SSH 连接 (自动跳转目录)                  |
| `opshop <name> logs` | 快速查看目标应用的输出日志 (`tail -f`)                |
| `opshop <name> restart` | 执行远程管理脚本进行重启                             |
| `opshop help` | 显示帮助信息                                   |

---

## 📁 数据格式 // Configuration
数据存储在 `~/.opshop/config.yaml`。
```yaml
workspaces:
  - name: "公司项目"
    nodes:
      - name: "生产服务器-05"
        ip: "121.57.165.264"
        user: "server"
        provider: "aliyun"
        owner: "鲸鱼公司"
        cpu: 4
        memory: "8G"
        apps:
          - name: "分销API"
            project: "distributor-api/distributor-client"
            deploy_path: "/home/server/app/distributor/distributor-client-api"
            port: 17070
            out_log_path: "logs/out.log"
```

---

## 📅 进阶开发路线图 // Roadmap

### Phase 1: 运维增强 (Ops Plus)
- [ ] **实时心跳监测 (Health Check)**：Web 界面通过绿/红灯实时展示应用存活状态。
- [ ] **标签过滤器 (Tag Filter)**：支持按标签（如：Java, 生产环境）一键筛选。
- [ ] **批量操作 (Broadcast)**：在一个工作空间的所有节点上同步执行指令。

### Phase 2: 团队协作 (Team Sync)
- [ ] **局域网 P2P 共享 (LAN Share)**：一键生成局域网 URL，让成员克隆你的配置。
- [ ] **SSH Key 路径管理**：支持针对不同 Node 绑定不同的私钥文件。
- [ ] **导入向导**：支持从现有文本或 Excel 批量导入资产。

### Phase 3: 安全与分发 (Security & Distribution)
- [ ] **敏感信息加密**：对备注中的密码等信息进行本地 AES 加密。
- [ ] **Homebrew 公式优化**：正式发布到 Homebrew Tap 仓库。
- [ ] **自动更新检测**：检测版本并在终端提醒升级。

---

## 🤝 贡献 // Contribution
如果你有更好的样式建议或功能想法，欢迎提交 Pull Request。

**Designed with ❤️ for Developers.**
