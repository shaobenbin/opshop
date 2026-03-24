package main

import (
	"bytes"
	"testing"
)

func TestRunAppPrintsUsageWhenNoArgs(t *testing.T) {
	var out bytes.Buffer
	connectCalled := false
	uiCalled := false

	runApp([]string{"opshop"}, &out, func() { uiCalled = true }, func(targetName, subCmd string) {
		connectCalled = true
	})

	if uiCalled {
		t.Fatal("expected ui not to start")
	}
	if connectCalled {
		t.Fatal("expected connect not to run")
	}
	if got := out.String(); got == "" {
		t.Fatal("expected usage output")
	}
}

func TestRunAppPrintsVersionForDashV(t *testing.T) {
	var out bytes.Buffer

	runApp([]string{"opshop", "-v"}, &out, func() {}, func(string, string) {})

	if got, want := out.String(), "OpsHop // Version: "+AppVersion+"\n"; got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}

func TestRunAppPrintsUsageForDashH(t *testing.T) {
	var out bytes.Buffer

	runApp([]string{"opshop", "-h"}, &out, func() {}, func(string, string) {})

	if got := out.String(); got == "" {
		t.Fatal("expected usage output")
	}
}

func TestRunAppStartsUIForUICommand(t *testing.T) {
	var out bytes.Buffer
	uiCalled := false

	runApp([]string{"opshop", "ui"}, &out, func() { uiCalled = true }, func(string, string) {})

	if !uiCalled {
		t.Fatal("expected ui to start")
	}
	if got := out.String(); got != "" {
		t.Fatalf("expected no output, got %q", got)
	}
}

func TestRunAppRoutesUnknownCommandToConnect(t *testing.T) {
	var out bytes.Buffer
	var gotTarget, gotSubCmd string

	runApp([]string{"opshop", "demo", "logs"}, &out, func() {}, func(targetName, subCmd string) {
		gotTarget = targetName
		gotSubCmd = subCmd
	})

	if gotTarget != "demo" || gotSubCmd != "logs" {
		t.Fatalf("expected connect args demo/logs, got %q/%q", gotTarget, gotSubCmd)
	}
}
