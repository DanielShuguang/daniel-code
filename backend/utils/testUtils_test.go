package utils

import (
	"runtime"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetProjectPath(t *testing.T) {
	a := assert.New(t)

	prjPath := GetProjectPath()
	a.NotEmpty(prjPath)
}

func TestGetCorrectPath(t *testing.T) {
	a := assert.New(t)

	p := "/var/local/test.md"
	res := GetCorrectPath(p)
	if runtime.GOOS == "windows" {
		a.NotEqual(p, res)
	} else {
		a.Equal(p, res)
	}
}
