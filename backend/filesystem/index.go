package filesystem

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func ReadFileContent(filePath string) FileContentResult {
	result := FileContentResult{
		Content: "", ErrorMessage: "", IsBinary: false,
	}
	file, err := os.Open(filePath)
	if err != nil {
		result.ErrorMessage = fmt.Sprintf("打开文件错误: %s", err.Error())
		return result
	}

	if isBinaryFile(file) {
		result.IsBinary = true
		result.ErrorMessage = "该文件为二进制文件"
		return result
	}
	file.Close()

	content, err := os.ReadFile(filePath)
	if err != nil {
		result.ErrorMessage = fmt.Sprintf("文件内容读取错误: %s", err.Error())
		return result
	}
	result.Content = string(content)
	return result
}

// 判断二进制文件
func isBinaryFile(file io.Reader) bool {
	r := bufio.NewReader(file)
	buf := make([]byte, 1024)
	n, err := r.Read(buf)
	if err != nil {
		return false
	}

	var white_byte int = 0
	for i := 0; i < n; i++ {
		if (buf[i] >= 0x20 && buf[i] <= 0xff) ||
			buf[i] == 9 ||
			buf[i] == 10 ||
			buf[i] == 13 {
			white_byte++
		} else if buf[i] <= 6 || (buf[i] >= 14 && buf[i] <= 31) {
			return true
		}
	}

	return white_byte < 1
}

func ReadDirTree(dirTree DirTree) {
	entries, err := os.ReadDir(dirTree.Path)
	if err != nil {
		return
	}
	for index, entry := range entries {
		isDir := entry.IsDir()
		if dirTree.Children == nil {
			dirTree.Children = make([]*DirTree, 0)
		}
		dirTree.Children = append(dirTree.Children, &DirTree{
			Name:     entry.Name(),
			Path:     fmt.Sprintf("%s/%s", dirTree.Path, entry.Name()),
			IsDir:    isDir,
			Type:     entry.Type().String(),
			Children: nil,
		})
		if isDir {
			ReadDirTree(*dirTree.Children[index])
		}
	}
}

func OpenFileByDialog(ctx context.Context) FileDetails {
	path, err := runtime.OpenFileDialog(ctx, runtime.OpenDialogOptions{})
	result := FileDetails{Err: ""}
	if err != nil {
		result.Err = fmt.Sprintf("打开资源管理器失败: %s", err.Error())
		return result
	}
	file := ReadFileContent(path)
	var pathList []string
	if strings.Contains(path, "/") {
		pathList = strings.Split(path, "/")
	} else {
		pathList = strings.Split(path, "\\")
	}
	result.IsBinary = file.IsBinary
	result.Name = pathList[len(pathList)-1]
	result.Err = file.ErrorMessage
	result.Content = file.Content
	result.Path = path

	if strings.Contains(result.Name, ".") {
		nameList := strings.Split(result.Name, ".")
		ext := nameList[len(nameList)-1]
		result.Type = ext
	}
	return result
}
