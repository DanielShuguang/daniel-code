package core

import (
	"changeme/backend/gitService"
)

func (a *App) GitLookup() bool {
	gitService := gitService.New()
	return gitService.IsAvailable
}
