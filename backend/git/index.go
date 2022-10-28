package git

import (
	"changeme/backend/command"
	"errors"
)

func GitAvailable() bool {
	_, err := command.Command("git", "-v")
	return err != nil
}

type GitService struct{}

func (git *GitService) Push() (string, error) {
	if !GitAvailable() {
		return "", errors.New("error: git isn't exist")
	}
	result, err := command.Command("git", "push")
	return result, err
}

func (git *GitService) Add(files ...string) (string, error) {
	if !GitAvailable() {
		return "", errors.New("error: git isn't exist")
	}
	args := append([]string{"git", "add"}, files...)
	result, err := command.Command(args...)
	return result, err
}

func (git *GitService) Commit(message string) (string, error) {
	if !GitAvailable() {
		return "", errors.New("error: git isn't exist")
	}
	result, err := command.Command("git", "commit", "-m", message)
	return result, err
}
