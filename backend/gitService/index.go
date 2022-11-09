package gitService

import (
	"changeme/backend/command"

	"github.com/go-git/go-git/v5"
)

type GitService struct {
	IsAvailable bool           `json:"is_available"`
	Repository  git.Repository `json:"repository,omitempty"`
}

func New() *GitService {
	gitService := &GitService{}
	gitService.GitAvailable()
	return gitService
}

func (g *GitService) GitAvailable() bool {
	_, err := command.Command("git", "-v")
	res := err != nil
	g.IsAvailable = res
	return res
}
