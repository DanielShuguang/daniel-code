package utils

import (
	"os"
	"runtime"
	"strings"
)

func GetProjectPath() string {
	pwd, err := os.Getwd()
	if err != nil {
		return ""
	}
	return pwd
}

// 根据系统的不同获取正确的路径
// （修改斜杠方向）
func GetCorrectPath(path string) string {
	correctPath := path
	if runtime.GOOS == "windows" {
		correctPath = strings.ReplaceAll(correctPath, "/", "\\")
	} else {
		correctPath = strings.ReplaceAll(correctPath, "\\", "/")
	}
	return correctPath
}
