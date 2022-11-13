package filesystem

import "strings"

type DirTree struct {
	Name        string    `json:"name"`
	Path        string    `json:"path"`
	IsDir       bool      `json:"isDir"`
	Type        string    `json:"type"`
	HasChildren bool      `json:"hasChildren"`
	Children    []DirTree `json:"children,omitempty"`
}

type SortByDirTree []DirTree

func (a SortByDirTree) Len() int {
	return len(a)
}
func (a SortByDirTree) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
func (a SortByDirTree) Less(i, j int) bool {
	if a[i].IsDir && !a[j].IsDir {
		return true
	} else if !a[i].IsDir && a[j].IsDir {
		return false
	}
	aName, bName := strings.ToLower(a[i].Name), strings.ToLower(a[j].Name)
	return strings.Compare(aName, bName) <= 0
}

type FileContentResult struct {
	Content  string `json:"content,omitempty"`
	Message  string `json:"message,omitempty"`
	IsBinary bool   `json:"isBinary"`
}

type FileDetails struct {
	Name     string `json:"name"`
	Path     string `json:"path"`
	Content  string `json:"content"`
	Message  string `json:"message,omitempty"`
	IsBinary bool   `json:"isBinary"`
	Type     string `json:"type,omitempty"`
}

type FileTreeResult struct {
	Message string  `json:"message,omitempty"`
	Data    DirTree `json:"data,omitempty"`
}

type ModifyFileContentResult struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
}

type FolderWatchInfo struct {
	Content string `json:"content"`
	Origin  string `json:"origin"`
	New     string `json:"new"`
}
