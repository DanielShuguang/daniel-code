package filesystem

import (
	"context"
	"fmt"
	"os"
	osRuntime "runtime"
	"sort"

	"github.com/pkg/errors"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// 监听获取项目地址，并启动文件系统监听
func InitProjectPath(ctx context.Context) {
	c, cancel := context.WithCancel(ctx)
	runtime.EventsOn(ctx, "backend:update-project-path", func(data ...any) {
		cancel()
		prjPath := data[0]
		if val, ok := prjPath.(string); ok {
			c, cancel = context.WithCancel(ctx)
			FsWatchStart(c, val)
		}
	})
}

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
		if isDir && entry.Name() == ".git" {
			// 忽略 .git 目录
			continue
		}

		splitLine := "/"
		if osRuntime.GOOS == "windows" {
			splitLine = "\\"
		}
		entryPath := fmt.Sprintf("%s%s%s", dirTree.Path, splitLine, entry.Name())
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
		result.Message = errors.Wrap(err, "读取目录失败").Error()
		return result
	} else if path == "" {
		result.Message = "cancel"
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
