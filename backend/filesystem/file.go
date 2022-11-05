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

// 从路径中截取文件名
func GetFileNameByPath(path string) string {
	var pathList []string
	if strings.Contains(path, "/") {
		pathList = strings.Split(path, "/")
	} else {
		pathList = strings.Split(path, "\\")
	}

	return pathList[len(pathList)-1]
}

// 从文件名中截取文件后缀（文件类型）
func GetFileTypeByName(name string) string {
	nameList := strings.Split(name, ".")
	ext := nameList[len(nameList)-1]
	return ext
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

// 读取文件详细信息及其文本内容
func ReadFileContent(filePath string) FileContentResult {
	result := FileContentResult{
		Content: "", Message: "", IsBinary: false,
	}
	file, err := os.Open(filePath)
	if err != nil {
		result.Message = fmt.Sprintf("打开文件错误: %s", err.Error())
		return result
	}

	if isBinaryFile(file) {
		result.IsBinary = true
		result.Message = "该文件为二进制文件"
		return result
	}
	file.Close()

	content, err := os.ReadFile(filePath)
	if err != nil {
		result.Message = fmt.Sprintf("文件内容读取错误: %s", err.Error())
		return result
	}
	result.Content = string(content)
	return result
}

// 弹窗打开文件
func OpenFileByDialog(ctx context.Context) FileDetails {
	path, err := runtime.OpenFileDialog(ctx, runtime.OpenDialogOptions{})
	result := FileDetails{Message: ""}
	if err != nil {
		result.Message = fmt.Sprintf("打开资源管理器失败: %s", err.Error())
		return result
	}
	file := ReadFileContent(path)
	result.IsBinary = file.IsBinary
	result.Name = GetFileNameByPath(path)
	result.Message = file.Message
	result.Content = file.Content
	result.Path = path

	if strings.Contains(result.Name, ".") {
		result.Type = GetFileTypeByName(result.Name)
	}
	return result
}
