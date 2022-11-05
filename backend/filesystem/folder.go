package filesystem

import (
	"context"
	"fmt"
	"os"
	"sort"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// 是否为空文件夹
func IsEmptyFolder(path string) bool {
	entries, err := os.ReadDir(path)
	if err != nil {
		return true
	}
	return len(entries) == 0
}

// 根据根目录信息获取目录树
func ReadFolderDetails(dirTree *DirTree) error {
	entries, err := os.ReadDir(dirTree.Path)
	if err != nil {
		return err
	}
	dirTree.HasChildren = len(entries) != 0
	if dirTree.Children == nil {
		dirTree.Children = []DirTree{}
	}
	for _, entry := range entries {
		isDir := entry.IsDir()
		entryPath := fmt.Sprintf("%s/%s", dirTree.Path, entry.Name())
		entryType := "folder"
		if !isDir {
			entryType = GetFileTypeByName(entry.Name())
		}
		dirTree.Children = append(dirTree.Children, DirTree{
			Name:        entry.Name(),
			Path:        entryPath,
			IsDir:       isDir,
			Type:        entryType,
			HasChildren: isDir && !IsEmptyFolder(entryPath),
			Children:    nil,
		})
	}
	if dirTree.HasChildren {
		sort.Sort(SortByDirTree(dirTree.Children))
	}
	return nil
}

// 弹窗打开文件夹（生成目录树）
func OpenFolderByDialog(ctx context.Context) FileTreeResult {
	path, err := runtime.OpenDirectoryDialog(ctx, runtime.OpenDialogOptions{})
	result := FileTreeResult{
		Data: DirTree{},
	}
	if err != nil {
		result.Message = fmt.Sprintf("读取目录失败: %s", err.Error())
		return result
	}
	result.Data = DirTree{
		Path:  path,
		Name:  GetFileNameByPath(path),
		IsDir: true,
		Type:  "folder",
	}
	err = ReadFolderDetails(&result.Data)
	if err != nil {
		result.Message = err.Error()
	}
	return result
}
