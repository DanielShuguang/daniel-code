package command

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCommand(t *testing.T) {
	a := assert.New(t)

	out, err := Command("go", "version")
	a.Nil(err)
	a.NotEmpty(out)

	out, err = Command("node", "-v")
	a.Nil(err)
	a.NotEmpty(out)
}
