package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadConfigInitializesMissingUserConfigFromEmbeddedDefault(t *testing.T) {
	tmpHome := t.TempDir()
	t.Setenv("HOME", tmpHome)

	configPath := filepath.Join(tmpHome, ".opshop", "config.yaml")
	if _, err := os.Stat(configPath); !os.IsNotExist(err) {
		t.Fatalf("expected config to be absent before load, got err=%v", err)
	}

	conf, err := LoadConfig()
	if err != nil {
		t.Fatalf("expected load to succeed, got %v", err)
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		t.Fatalf("expected initialized config file, got %v", err)
	}
	if len(data) == 0 {
		t.Fatal("expected initialized config file to contain default yaml")
	}
	if conf.Workspaces == nil {
		t.Fatal("expected workspaces slice to be initialized")
	}
	if len(conf.Langs) == 0 {
		t.Fatal("expected default langs to be loaded")
	}
	if len(conf.AppTypes) == 0 {
		t.Fatal("expected default app types to be loaded")
	}
	if len(conf.NodeProviders) == 0 {
		t.Fatal("expected default node providers to be loaded")
	}
}
