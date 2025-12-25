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

// NodeProvider 节点提供商
type NodeProvider struct {
	ID        string `yaml:"id" json:"id"`
	Name      string `yaml:"name" json:"name"`             // 云厂商名
	IsDefault bool   `yaml:"is_default" json:"is_default"` // 是否为系统默认
}

// Project 全局项目实体
type Project struct {
	ID   string `yaml:"id" json:"id"`
	Name string `yaml:"name" json:"name"` // 业务名称：如“分销系统”
}

// Lang 全局语言实体
type Lang struct {
	ID        string `yaml:"id" json:"id"`
	Name      string `yaml:"name" json:"name"`
	IsDefault bool   `yaml:"is_default" json:"is_default"` // 是否为系统默认
}

// AppType 全局应用类型实体
type AppType struct {
	ID        string `yaml:"id" json:"id"`
	Name      string `yaml:"name" json:"name"`
	IsDefault bool   `yaml:"is_default" json:"is_default"` // 是否为系统默认
}

// DefaultLangs 定义系统默认Lang值
var DefaultLangs = []Lang{
	{ID: "def_java", Name: "Java", IsDefault: true},
	{ID: "def_python", Name: "Python", IsDefault: true},
	{ID: "def_golang", Name: "Golang", IsDefault: true},
	{ID: "def_rust", Name: "Rust", IsDefault: true},
	{ID: "def_nodejs", Name: "Node.js", IsDefault: true},
}

// DefaultAppTypes 定义系统默认AppTypes值
var DefaultAppTypes = []AppType{
	{ID: "def_api", Name: "api", IsDefault: true},
	{ID: "def_web", Name: "web", IsDefault: true},
	{ID: "def_wap", Name: "wap", IsDefault: true},
	{ID: "def_app", Name: "独立应用程序", IsDefault: true},
	{ID: "def_service", Name: "web服务应用", IsDefault: true},
}

var DefaultNodeProviders = []NodeProvider{
	{ID: "def_aliyun", Name: "Aliyun (阿里云)", IsDefault: true},
	{ID: "def_tencent_count", Name: "Tencent (腾讯云)", IsDefault: true},
	{ID: "def_huawei_cloud", Name: "Huawei (华为云)", IsDefault: true},
	{ID: "def_baidu_cloud", Name: "Huawei (百度云)", IsDefault: true},
	{ID: "def_aws_cloud", Name: "AWS", IsDefault: true},
	{ID: "def_azure_cloud", Name: "Azure", IsDefault: true},
	{ID: "def_google_cloud", Name: "Google Cloud", IsDefault: true},
	{ID: "def_local_service", Name: "Local (自建/其他)", IsDefault: true},
}

// App 模型升级
type App struct {
	ID            string      `yaml:"id" json:"id"`
	Name          string      `yaml:"name" json:"name"`
	ProjectID     string      `yaml:"project_id" json:"project_id"`   // 关联全局 Project ID
	SourcePath    string      `yaml:"source_path" json:"source_path"` // 源码路径：slan_agri_spot_exchange/rest/app
	DeployPath    string      `yaml:"deploy_path" json:"deploy_path"`
	Domain        string      `yaml:"domain" json:"domain"`
	LangID        string      `yaml:"lang_id" json:"lang_id"`         // 改为关联 ID
	AppTypeID     string      `yaml:"app_type_id" json:"app_type_id"` // 改为关联 ID
	Port          int         `yaml:"port" json:"port"`
	OutLogPath    string      `yaml:"out_log_path" json:"out_log_path"`
	ErrLogPath    string      `yaml:"err_log_path" json:"err_log_path"`
	ManagerScript string      `yaml:"manager_script" json:"manager_script"`
	Tags          []string    `yaml:"tags" json:"tags"`
	Remarks       string      `yaml:"remarks" json:"remarks"`
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
	ProviderId string `yaml:"provider_id" json:"provider_id"`
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
	Workspaces    []Workspace    `yaml:"workspaces" json:"workspaces"`
	Projects      []Project      `yaml:"projects" json:"projects"`   // 全局项目库
	Langs         []Lang         `yaml:"langs" json:"langs"`         // 全局语言库
	AppTypes      []AppType      `yaml:"app_types" json:"app_types"` // 全局类型库
	NodeProviders []NodeProvider `yaml:"node_providers" json:"node_providers"`
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

	// 核心逻辑：确保系统默认值始终存在 (防止用户手动从 YAML 删除了默认值)
	conf.Langs = mergeLangs(conf.Langs, DefaultLangs)
	conf.AppTypes = mergeAppTypes(conf.AppTypes, DefaultAppTypes)
	conf.NodeProviders = mergeNodeProviders(conf.NodeProviders, DefaultNodeProviders)
	return conf, nil
}

// 辅助函数：合并用户自定义值和系统默认值
func mergeLangs(current []Lang, defaults []Lang) []Lang {
	m := make(map[string]Lang)
	for _, item := range current {
		m[item.ID] = item
	}
	for _, item := range defaults {
		m[item.ID] = item
	} // 强制覆盖/补充默认值

	res := []Lang{}
	for _, v := range m {
		res = append(res, v)
	}
	return res
}

func mergeAppTypes(current []AppType, defaults []AppType) []AppType {
	m := make(map[string]AppType)
	for _, item := range current {
		m[item.ID] = item
	}
	for _, item := range defaults {
		m[item.ID] = item
	}

	res := []AppType{}
	for _, v := range m {
		res = append(res, v)
	}
	return res
}

func mergeNodeProviders(current []NodeProvider, defaults []NodeProvider) []NodeProvider {
	m := make(map[string]NodeProvider)
	for _, item := range current {
		m[item.ID] = item
	}
	for _, item := range defaults {
		m[item.ID] = item
	}
	res := []NodeProvider{}
	for _, v := range m {
		res = append(res, v)
	}
	return res
}

func SaveConfig(conf *Config) error {
	path := getConfigPath()
	os.MkdirAll(filepath.Dir(path), 0755)
	data, _ := yaml.Marshal(conf)
	return os.WriteFile(path, data, 0644)
}
