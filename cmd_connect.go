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
	App  *App // 如果是直接匹配到 Node，则 App 为 nil
}

// RunConnect 根据目标名进行搜索，支持多结果交互选择
func RunConnect(target string, subCmd string) {
	conf, err := LoadConfig()
	if err != nil {
		fmt.Printf("错误: 无法加载配置: %v\n", err)
		return
	}

	var matches []MatchResult

	// 1. 搜集所有匹配项
	for _, ws := range conf.Workspaces {
		for i := range ws.Nodes {
			node := &ws.Nodes[i]
			// 匹配服务器名
			if strings.Contains(strings.ToLower(node.Name), strings.ToLower(target)) {
				// 如果直接匹配到服务器，我们也把它加入备选
				matches = append(matches, MatchResult{Node: node, App: nil})
			}
			// 匹配应用名
			for j := range node.Apps {
				app := &node.Apps[j]
				if strings.Contains(strings.ToLower(app.Name), strings.ToLower(target)) {
					matches = append(matches, MatchResult{Node: node, App: app})
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
				// 输出格式: 1、[应用名] (项目名) - 部署在 [服务器名](IP)
				fmt.Printf("%d、%s (%s) - [%s (%s)]\n", i+1, m.App.Name, m.App.Project, m.Node.Name, m.Node.IP)
			} else {
				// 输出格式: 2、[服务器名] (IP)
				fmt.Printf("%d、服务器: %s (%s)\n", i+1, m.Node.Name, m.Node.IP)
			}
		}
		fmt.Print("\n请输入数字编号选择，输入 'n' 取消: ")

		// 读取用户输入
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
	app := m.App

	dest := fmt.Sprintf("%s@%s", node.User, node.IP)
	var remoteCmd string

	if app != nil {
		appDir := app.DeployPath
		switch subCmd {
		case "logs":
			// 只有 App 匹配时才支持 logs。优先检查错误日志，无输入则默认 OutLog
			logFile := resolvePath(appDir, app.OutLogPath)
			remoteCmd = fmt.Sprintf("cd %s && tail -f %s", appDir, logFile)
		case "start", "stop", "restart", "status":
			script := resolvePath(appDir, app.ManagerScript)
			remoteCmd = fmt.Sprintf("cd %s && bash %s %s", appDir, script, subCmd)
		default:
			remoteCmd = fmt.Sprintf("cd %s && bash --login", appDir)
		}
	}

	executeSSH(dest, remoteCmd)
}

// resolvePath 辅助函数：处理相对路径和绝对路径
func resolvePath(base string, target string) string {
	if filepath.IsAbs(target) || strings.HasPrefix(target, "/") {
		return target
	}
	// 如果是相对路径，则拼接在部署目录之后
	return filepath.Join(base, target)
}

// executeSSH 调用系统 SSH 客户端
func executeSSH(dest string, remoteCmd string) {
	args := []string{dest}
	if remoteCmd != "" {
		// 使用 -t 强制分配伪终端，否则 cd 完之后会断开连接
		args = append(args, "-t", remoteCmd)
	}

	fmt.Printf(">>> 正在连接: %s\n", dest)
	if remoteCmd != "" {
		fmt.Printf(">>> 执行指令: %s\n", remoteCmd)
	}

	cmd := exec.Command("ssh", args...)

	// 关键点：将系统的标准输入、输出、错误流重定向给 SSH 命令
	// 这样你才能在 iTerm2 里看到远程界面并输入密码/命令
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()
	if err != nil {
		fmt.Printf("SSH 连接已断开: %v\n", err)
	}
}
