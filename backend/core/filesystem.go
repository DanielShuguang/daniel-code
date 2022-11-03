package core

import (
	"changeme/backend/filesystem"
	"strings"
)

// 读取指定目录的文件树
func (a *App) ReadDirTree(dirPath string) filesystem.DirTree {
	pathList := strings.Split(dirPath, "/")
	dirTree := filesystem.DirTree{
		Name:     pathList[len(pathList)-1],
		Path:     dirPath,
		IsDir:    true,
		Type:     "folder",
		Children: nil,
	}
	filesystem.ReadDirTree(dirTree)
	return dirTree
}

// 读取文件内容
func (a *App) ReadFileContent(filePath string) filesystem.FileContentResult {
	return filesystem.ReadFileContent(filePath)
}

func (a *App) OpenFileByDialog() filesystem.FileDetails {
	return filesystem.OpenFileByDialog(a.ctx)
}
