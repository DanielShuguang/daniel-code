package filesystem

import (
	"changeme/backend/utils"
	"os"
	"path"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetFileNameByPath(t *testing.T) {
	a := assert.New(t)
	prjPath := utils.GetProjectPath()
	filename := "emptyFile.txt"

	fullPath := path.Join(prjPath, testPath+"/"+filename)
	name := GetFileNameByPath(fullPath)
	a.Equal(filename, name)
}

func TestGetFileTypeByName(t *testing.T) {
	a := assert.New(t)

	name := "test.js"
	ext := GetFileTypeByName(name)
	a.Equal("js", ext)
}

func TestIsBinaryFile(t *testing.T) {
	a := assert.New(t)
	prjPath := utils.GetProjectPath()

	fullPath := path.Join(prjPath, utils.GetCorrectPath(testPath+"/binary.png"))
	file, err := os.Open(fullPath)
	a.Nil(err)
	isBinary := isBinaryFile(file)
	a.True(isBinary)

	fullPath = path.Join(prjPath, utils.GetCorrectPath(testPath+"/emptyFile.txt"))
	file, err = os.Open(fullPath)
	a.Nil(err)
	isBinary = isBinaryFile(file)
	a.False(isBinary)
}

func TestReadFileContent(t *testing.T) {
	a := assert.New(t)
	prjPath := utils.GetProjectPath()

	filePath := path.Join(prjPath, utils.GetCorrectPath(testPath+"/binary.png"))
	result := ReadFileContent(filePath)
	a.Empty(result.Content)
	a.NotEmpty(result.Message)
	a.True(result.IsBinary)

	filePath = path.Join(prjPath, utils.GetCorrectPath(testPath+"/emptyFile.txt"))
	result = ReadFileContent(filePath)
	a.Empty(result.Content)
	a.Empty(result.Message)
	a.False(result.IsBinary)

	filePath = path.Join(prjPath, utils.GetCorrectPath(testPath+"/file.txt"))
	result = ReadFileContent(filePath)
	a.NotEmpty(result.Content)
	a.Empty(result.Message)
	a.False(result.IsBinary)
}

func TestModifyFileContent(t *testing.T) {
	a := assert.New(t)
	prjPath := utils.GetProjectPath()

	filePath := path.Join(prjPath, utils.GetCorrectPath(testPath+"/file.txt"))
	result := ModifyFileContent(filePath, "Not Empty")
	a.Empty(result.Message)
	a.True(result.Success)

	filePath = path.Join(prjPath, utils.GetCorrectPath(testPath+"/file2.md"))
	result = ModifyFileContent(filePath, "Not Empty 2")
	a.Empty(result.Message)
	a.True(result.Success)
}
