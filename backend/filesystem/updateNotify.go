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
func FsWatchStart(ctx context.Context, dirPath string) {
	watch, err := fsnotify.NewWatcher()
	if err != nil {
		return
	}
	defer watch.Close()

	go func(c context.Context) {
		isRename := false
		renameFile := ""
		for {
			select {
			case ev, ok := <-watch.Events:
				if !ok {
					return
				}
				//判断事件发生的类型，如下5种
				// Create 创建
				// Write 写入
				// Remove 删除
				// Rename 重命名
				// Chmod 修改权限
				fmt.Println("updating project", ev.Op.String())
				if ev.Op&fsnotify.Create == fsnotify.Create {
					if isRename {
						eventStart(c, "rename", renameFile, ev.Name)
						isRename = false
						renameFile = ""
					} else {
						eventStart(c, "create", ev.Name, ev.Name)
					}
				}
				if ev.Op&fsnotify.Write == fsnotify.Write {
					eventStart(c, "write", ev.Name, ev.Name)
				}
				if ev.Op&fsnotify.Remove == fsnotify.Remove {
					eventStart(c, "delete", ev.Name, ev.Name)
				}
				if ev.Op&fsnotify.Rename == fsnotify.Rename {
					isRename = true
					renameFile = ev.Name
				}
				if ev.Op&fsnotify.Chmod == fsnotify.Chmod {
					eventStart(c, "chmod", ev.Name, ev.Name)
				}
			case err, ok := <-watch.Errors:
				if ok {
					eventStart(c, fmt.Sprintf("error: %v", err), "", "")
					return
				}
			}
		}
	}(ctx)

	err = watch.Add(utils.GetCorrectPath(dirPath))
	if err != nil {
		return
	}
	<-ctx.Done()
}

func eventStart(ctx context.Context, content, oldFile, newFile string) {
	runtime.EventsEmit(ctx, notifyName, FolderWatchInfo{
		Content: content,
		Origin:  oldFile,
		New:     newFile,
	})
}
