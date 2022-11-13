package core

import (
	"changeme/backend/filesystem"
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// Startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	go filesystem.InitProjectPath(a.ctx)
}

func (a *App) Shutdown(ctx context.Context) {
	runtime.EventsOffAll(ctx)
}
