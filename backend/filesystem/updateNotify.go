package filesystem

import (
	"changeme/backend/utils"
	"context"
	"fmt"

	"github.com/fsnotify/fsnotify"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const notifyName = "backend:folder-update"

// 监控项目文件更新
func FsWatchStart(c chan context.Context, dirPath string) {
	ctx := <-c
	watch, err := fsnotify.NewWatcher()
	if err != nil {
		return
	}
	defer watch.Close()

	err = watch.Add(utils.GetCorrectPath(dirPath))
	if err != nil {
		return
	}

	go func() {
		isRename := false
		renameFile := ""
		for {
			select {
			case ev := <-watch.Events:
				{
					//判断事件发生的类型，如下5种
					// Create 创建
					// Write 写入
					// Remove 删除
					// Rename 重命名
					// Chmod 修改权限
					if ev.Op&fsnotify.Create == fsnotify.Create {
						if isRename {
							eventStart(ctx, "rename", renameFile, ev.Name)
							isRename = false
							renameFile = ""
						} else {
							eventStart(ctx, "create", ev.Name, ev.Name)
						}
					}
					if ev.Op&fsnotify.Write == fsnotify.Write {
						eventStart(ctx, "write", ev.Name, ev.Name)
					}
					if ev.Op&fsnotify.Remove == fsnotify.Remove {
						eventStart(ctx, "delete", ev.Name, ev.Name)
					}
					if ev.Op&fsnotify.Rename == fsnotify.Rename {
						isRename = true
						renameFile = ev.Name
					}
					if ev.Op&fsnotify.Chmod == fsnotify.Chmod {
						eventStart(ctx, "chmod", ev.Name, ev.Name)
					}
				}
			case err := <-watch.Errors:
				{
					eventStart(ctx, fmt.Sprintf("error: %v", err), "", "")
				}
			}
		}
	}()
}

func eventStart(ctx context.Context, content, oldFile, newFile string) {
	runtime.EventsEmit(ctx, notifyName, FolderWatchInfo{
		Content: content,
		Origin:  oldFile,
		New:     newFile,
	})
}
