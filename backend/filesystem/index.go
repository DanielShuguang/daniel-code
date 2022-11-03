package filesystem

import (
	"bufio"
	"fmt"
	"io"
	"os"
)

type DirTree struct {
	Name     string     `json:"name,omitempty"`
	Path     string     `json:"path,omitempty"`
	IsDir    bool       `json:"isDir,omitempty"`
	Type     string     `json:"type,omitempty"`
	Children []*DirTree `json:"children,omitempty"`
}

type FileContentResult struct {
	Content      string `json:"content,omitempty"`
	ErrorMessage string `json:"errorMessage,omitempty"`
	IsBinary     bool   `json:"isBinary,omitempty"`
}

func ReadFileContent(filePath string) FileContentResult {
	result := FileContentResult{
		Content: "", ErrorMessage: "", IsBinary: false,
	}
	file, err := os.Open(filePath)
	if err != nil {
		result.ErrorMessage = err.Error()
		return result
	}
	defer file.Close()

	if isBinaryFile(file) {
		result.IsBinary = true
		result.ErrorMessage = "this is a binary file"
		return result
	}

	info, err := file.Stat()
	if err != nil {
		result.ErrorMessage = err.Error()
		return result
	}

	content := make([]byte, info.Size())
	_, err = file.Read(content)
	if err != nil {
		result.ErrorMessage = err.Error()
		return result
	}
	result.Content = string(content)
	result.ErrorMessage = ""
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
