package base

import "changeme/backend/git"

func (a *App) GitLookup() bool {
	return git.GitAvailable()
}
