package main

import (
	"embed"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/fs"
	"net/http"
	"os"
	"os/exec"
)

// 使用 go:embed 指令，将 web 目录下的所有文件嵌入到二进制中
//
//go:embed web/*
var webFiles embed.FS

//TIP To run your code, right-click the code and select <b>Run</b>. Alternatively, click
// the <icon src="AllIcons.Actions.Execute"/> icon in the gutter and select the <b>Run</b> menu item from here.

func main() {

	if len(os.Args) < 2 {
		printUsage()
		return
	}

	// 获取命令行参数
	args := os.Args

	action := args[1]

	switch action {
	case "ui":
		startWebServer()
	case "help":
		printUsage()
	default:
		// 如果第一个参数不是 ui，那么它就是我们要连接的目标名
		targetName := action
		subCmd := ""
		if len(os.Args) > 2 {
			subCmd = os.Args[2] // 比如 logs, start 等
		}
		RunConnect(targetName, subCmd)
	}
}

func startWebServer() {
	// 设置为生产模式，减少日志输出
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	// 重点：处理嵌入文件
	// 因为 embed 包含 web 路径，我们需要去掉 web 前缀
	subFS, _ := fs.Sub(webFiles, "web")

	// 将嵌入的文件系统通过 HTTP 暴露出来
	// 用户访问 http://localhost:18181/static/js/vue.global.js 时，
	// 实际上是从 Go 的二进制内存中读取数据
	r.StaticFS("/static", http.FS(subFS))

	// 2. 首页渲染
	r.GET("/", func(c *gin.Context) {
		html, _ := webFiles.ReadFile("web/index.html")
		c.Data(http.StatusOK, "text/html; charset=utf-8", html)
	})

	// 3. API: 获取配置
	r.GET("/api/config", func(c *gin.Context) {
		conf, err := LoadConfig()
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, conf)
	})

	// 4. API: 保存配置 (全量覆盖)
	r.POST("/api/config", func(c *gin.Context) {
		var conf Config
		if err := c.ShouldBindJSON(&conf); err != nil {
			c.JSON(400, gin.H{"error": "无效的数据结构"})
			return
		}
		if err := SaveConfig(&conf); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"status": "success"})
	})

	fmt.Println("------------------------------------------")
	fmt.Println("OpsHop 管理后台已启动")
	fmt.Println("地址: http://127.0.0.1:18181")
	fmt.Println("所有资源已离线打包，无需互联网连接")
	fmt.Println("------------------------------------------")

	// 打开浏览器，仅限mac
	openErr := exec.Command("open", "http://127.0.0.1:18181").Start()
	if openErr != nil {
		return
	}

	// 启动端口
	runErr := r.Run(":18181")
	if runErr != nil {
		return
	}
}

func printUsage() {
	println("OpsHop // 使用说明:")
	println("  opshop ui              - 启动可视化面板")
	println("  opshop <应用名>         - 快速连接并跳转目录")
	println("  opshop <应用名> logs    - 查看应用实时日志")
	println("  opshop <应用名> restart - 重启应用服务")
}

//TIP See GoLand help at <a href="https://www.jetbrains.com/help/go/">jetbrains.com/help/go/</a>.
// Also, you can try interactive lessons for GoLand by selecting 'Help | Learn IDE Features' from the main menu.
