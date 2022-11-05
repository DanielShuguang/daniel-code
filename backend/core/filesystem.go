package core

import (
	"changeme/backend/filesystem"
)

// 读取指定目录的文件树
func (a *App) ReadDirTree(dirPath string) filesystem.FileTreeResult {
	result := filesystem.FileTreeResult{
		Data: filesystem.DirTree{
			Name:  filesystem.GetFileNameByPath(dirPath),
			Path:  dirPath,
			IsDir: true,
			Type:  "folder",
		},
	}
	err := filesystem.ReadFolderDetails(&result.Data)
	if err != nil {
		result.Message = err.Error()
	}
	return result
}

// 读取文件内容
func (a *App) ReadFileContent(filePath string) filesystem.FileContentResult {
	return filesystem.ReadFileContent(filePath)
}

// 打开文件
func (a *App) OpenFileByDialog() filesystem.FileDetails {
	return filesystem.OpenFileByDialog(a.ctx)
}

// 打开目录
func (a *App) OpenFolderByDialog() filesystem.FileTreeResult {
	return filesystem.OpenFolderByDialog(a.ctx)
}
