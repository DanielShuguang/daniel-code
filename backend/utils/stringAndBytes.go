package utils

import (
	"reflect"
	"unsafe"
)

// string 和 []byte 相互强制转换，性能更好但存在风险，
// 非高性能场景请勿使用

func String2Bytes(s string) []byte {
	sh := (*reflect.StringHeader)(unsafe.Pointer(&s))
	bh := reflect.SliceHeader{
		Data: sh.Data,
		Len:  sh.Len,
		Cap:  sh.Len,
	}
	return *(*[]byte)(unsafe.Pointer(&bh))
}

func Bytes2String(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}
