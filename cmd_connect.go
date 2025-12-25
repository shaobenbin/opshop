package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

// MatchResult 存储匹配到的结果及上下文
type MatchResult struct {
	Node *Node
	User *User // 必须包含用户上下文
	App  *App
}

// RunConnect 根据目标名进行搜索，支持多结果交互选择
func RunConnect(target string, subCmd string) {
	conf, err := LoadConfig()
	if err != nil {
		fmt.Printf("错误: 无法加载配置: %v\n", err)
		return
	}

	var matches []MatchResult

	// 1. 遍历三层结构进行匹配
	for _, ws := range conf.Workspaces {
		for i := range ws.Nodes {
			node := &ws.Nodes[i]
			// A. 匹配节点名
			if strings.Contains(strings.ToLower(node.Name), strings.ToLower(target)) {
				// 如果直接匹配到节点，默认使用该节点下的第一个用户
				if len(node.Users) > 0 {
					matches = append(matches, MatchResult{Node: node, User: &node.Users[0], App: nil})
				}
			}

			// B. 遍历用户
			for k := range node.Users {
				user := &node.Users[k]
				// C. 遍历应用
				for j := range user.Apps {
					app := &user.Apps[j]
					if strings.Contains(strings.ToLower(app.Name), strings.ToLower(target)) {
						matches = append(matches, MatchResult{Node: node, User: user, App: app})
					}
				}
			}
		}
	}

	// 2. 处理匹配结果数量
	if len(matches) == 0 {
		fmt.Printf("未找到包含 '%s' 的应用或服务器。\n", target)
		return
	}

	var selected MatchResult

	if len(matches) == 1 {
		selected = matches[0]
	} else {
		// 3. 多项匹配，进入交互选择
		fmt.Printf("找到多个与 '%s' 相关的目标，请选择:\n\n", target)
		for i, m := range matches {
			if m.App != nil {
				// 输出格式: 1、[应用名] (项目名) - 用户:[用户名] @ [服务器名](IP)
				fmt.Printf("%d、%s (%s) - 用户:%s @ [%s (%s)]\n", i+1, m.App.Name, m.App.SourcePath, m.User.Username, m.Node.Name, m.Node.IP)
			} else {
				// 输出格式: 2、服务器: [服务器名] (IP) - 默认用户: [用户名]
				fmt.Printf("%d、服务器: %s (%s) - 默认用户: %s\n", i+1, m.Node.Name, m.Node.IP, m.User.Username)
			}
		}
		fmt.Print("\n请输入数字编号选择，输入 'n' 取消: ")

		reader := bufio.NewReader(os.Stdin)
		input, _ := reader.ReadString('\n')
		input = strings.TrimSpace(input)

		if strings.ToLower(input) == "n" || input == "" {
			fmt.Println("操作已取消。")
			return
		}

		idx, err := strconv.Atoi(input)
		if err != nil || idx < 1 || idx > len(matches) {
			fmt.Println("输入无效，操作已取消。")
			return
		}
		selected = matches[idx-1]
	}

	// 4. 执行 SSH 连接
	startSSH(selected, subCmd)
}

// startSSH 构建并执行最终的 SSH 命令
func startSSH(m MatchResult, subCmd string) {
	node := m.Node
	user := m.User // 从 MatchResult 直接获取 User 对象
	app := m.App

	var remoteCmd string

	// 如果匹配到了应用，处理路径和子命令逻辑
	if app != nil {
		appDir := app.DeployPath
		switch subCmd {
		case "logs":
			logFile := resolvePath(appDir, app.OutLogPath)
			remoteCmd = fmt.Sprintf("cd %s && tail -f %s", appDir, logFile)
		case "start", "stop", "restart", "status":
			script := resolvePath(appDir, app.ManagerScript)
			remoteCmd = fmt.Sprintf("cd %s && bash %s %s", appDir, script, subCmd)
		default:
			// 默认：登录并跳转目录
			remoteCmd = fmt.Sprintf("cd %s && bash --login", appDir)
		}
	}

	// 修正：传入 Node 对象, User 对象, 以及命令字符串
	executeSSH(node, user, remoteCmd)
}

// resolvePath 辅助函数：处理相对路径和绝对路径
func resolvePath(base string, target string) string {
	// 如果是绝对路径
	if filepath.IsAbs(target) || strings.HasPrefix(target, "/") {
		return target
	}
	// 如果是相对路径，则拼接在部署目录之后
	// 注意：这里用 path 而不是 filepath，因为远程服务器通常是 Linux
	return strings.TrimSuffix(base, "/") + "/" + strings.TrimPrefix(target, "/")
}

// executeSSH 调用系统 SSH 客户端
func executeSSH(node *Node, user *User, remoteCmd string) {
	// 修正：从 user.Username 获取用户名
	dest := fmt.Sprintf("%s@%s", user.Username, node.IP)
	args := []string{dest}

	if remoteCmd != "" {
		args = append(args, "-t", remoteCmd)
	}

	// 逻辑：如果设置了密码，给予提醒
	fmt.Println("------------------------------------------------")
	if user.Password != "" {
		fmt.Printf("[AUTH] 用户 [%s] 已设置密码。\n", user.Username)
		fmt.Printf("[PWD]  密码为: %s (请在下方提示时输入/粘贴)\n", user.Password)
	} else {
		fmt.Printf("[AUTH] 未设置密码，尝试通过本地 SSH Key (免密) 登录...\n")
	}
	fmt.Printf("[DEST] 目标地址: %s\n", dest)
	fmt.Println("------------------------------------------------")

	cmd := exec.Command("ssh", args...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	_ = cmd.Run()
}
