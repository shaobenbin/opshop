package main

import (
	"gopkg.in/yaml.v3"
	"os"
	"path/filepath"
)

// HealthCheck 健康检查配置
type HealthCheck struct {
	URL     string `yaml:"url" json:"url"`
	Keyword string `yaml:"keyword" json:"keyword"`
}

// App 模型升级
type App struct {
	ID            string      `yaml:"id" json:"id"`
	Name          string      `yaml:"name" json:"name"`
	Project       string      `yaml:"project" json:"project"`
	DeployPath    string      `yaml:"deploy_path" json:"deploy_path"` // 部署目录
	Domain        string      `yaml:"domain" json:"domain"`           // 外部域名 (新)
	Lang          string      `yaml:"lang" json:"lang"`
	AppType       string      `yaml:"app_type" json:"app_type"`
	Port          int         `yaml:"port" json:"port"`                     // 内部端口
	OutLogPath    string      `yaml:"out_log_path" json:"out_log_path"`     // 输出日志 (stdout)
	ErrLogPath    string      `yaml:"err_log_path" json:"err_log_path"`     // 错误日志 (stderr)
	ManagerScript string      `yaml:"manager_script" json:"manager_script"` // 管理脚本 (script)
	Tags          []string    `yaml:"tags" json:"tags"`
	Remarks       string      `yaml:"remarks" json:"remarks"` // 备注 (已移至基本配置)
	Health        HealthCheck `yaml:"health" json:"health"`
}

type User struct {
	ID       string `yaml:"id" json:"id"`
	Username string `yaml:"username" json:"username"`
	Password string `yaml:"password" json:"password"` // 如果为空，则视为免密登录
	Apps     []App  `yaml:"apps" json:"apps"`         // 应用挂在用户下
}

// Node 模型升级：增加规格、到期时间和备注
type Node struct {
	ID         string `yaml:"id" json:"id"`
	Name       string `yaml:"name" json:"name"`
	IP         string `yaml:"ip" json:"ip"`
	Provider   string `yaml:"provider" json:"provider"`
	Owner      string `yaml:"owner" json:"owner"`
	CPU        int    `yaml:"cpu" json:"cpu"`               // CPU 核数 (vCPU)
	Memory     string `yaml:"memory" json:"memory"`         // 内存大小 (e.g. 8G)
	Expiration string `yaml:"expiration" json:"expiration"` // 到期时间 (e.g. 2026-01-01)
	Remarks    string `yaml:"remarks" json:"remarks"`       // 服务器备注
	Users      []User `yaml:"users" json:"users"`           // 服务器包含多个用户
}

type Workspace struct {
	ID    string `yaml:"id" json:"id"`
	Name  string `yaml:"name" json:"name"`
	Nodes []Node `yaml:"nodes" json:"nodes"`
}

type Config struct {
	Workspaces []Workspace `yaml:"workspaces" json:"workspaces"`
}

// --- 持久化逻辑保持不变 ---
func getConfigPath() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".opshop", "config.yaml")
}

func LoadConfig() (*Config, error) {
	path := getConfigPath()
	conf := &Config{Workspaces: []Workspace{}}
	data, readFileErr := os.ReadFile(path)
	if readFileErr != nil {
		return conf, nil
	}

	parseErr := yaml.Unmarshal(data, conf)
	if parseErr != nil {
		return nil, parseErr
	}

	if conf.Workspaces == nil {
		conf.Workspaces = []Workspace{}
	}
	return conf, nil
}

func SaveConfig(conf *Config) error {
	path := getConfigPath()
	os.MkdirAll(filepath.Dir(path), 0755)
	data, _ := yaml.Marshal(conf)
	return os.WriteFile(path, data, 0644)
}
