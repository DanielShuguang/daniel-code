package utils

import (
	"bytes"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestString2Bytes(t *testing.T) {
	a := assert.New(t)

	sourceList := []string{
		"Hello world", "test string", "123456",
	}

	for _, str := range sourceList {
		bytes1 := String2Bytes(str)
		bytes2 := []byte(str)
		isEq := bytes.Equal(bytes1, bytes2)
		a.True(isEq)
	}

	bytes1 := String2Bytes("string 1")
	bytes2 := []byte("string 2")
	isEq := bytes.Equal(bytes1, bytes2)
	a.False(isEq)
}

func TestBytes2String(t *testing.T) {
	a := assert.New(t)

	stringList := []string{
		"Hello world", "test string", "123456",
	}
	byteList := [][]byte{}
	for _, str := range stringList {
		byteList = append(byteList, []byte(str))
	}

	for i, b := range byteList {
		str := Bytes2String(b)
		a.Equal(stringList[i], str)
	}
}
