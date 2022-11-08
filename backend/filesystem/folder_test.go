package filesystem

import (
	"changeme/backend/utils"
	"path"
	"testing"

	"github.com/stretchr/testify/assert"
)

const testPath = "../testMock"

func TestIsEmptyFolder(t *testing.T) {
	a := assert.New(t)
	prjPath := utils.GetProjectPath()

	res := IsEmptyFolder(path.Join(prjPath, utils.GetCorrectPath(testPath+"/emptyFolder")))
	a.True(res)

	res = IsEmptyFolder(path.Join(prjPath, utils.GetCorrectPath(testPath)))
	a.False(res)
}

func TestReadFolderDetails(t *testing.T) {
	a := assert.New(t)
	prjPath := utils.GetProjectPath()

	dirPath := path.Join(prjPath, utils.GetCorrectPath(testPath))
	dirTree := DirTree{
		Name:  GetFileNameByPath(dirPath),
		Path:  dirPath,
		Type:  "folder",
		IsDir: true,
	}
	err := ReadFolderDetails(&dirTree)

	a.Nil(err)
	a.True(dirTree.HasChildren)
	a.NotNil(dirTree.Children)
	a.NotZero(len(dirTree.Children))
	a.True(dirTree.Children[0].IsDir)
}
