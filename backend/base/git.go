package base

import "changeme/backend/git"

func (a *App) GitLookup() {
	git.GitAvailable()
	g := &git.GitService{}
	g.Add()
}
