#! /bin/bash

# 生成测试覆盖报告
go test -covermode=count -coverprofile=backend-test-coverage.cov -run="^Test" -coverpkg=$(go list ./... | grep -v "/test" | tr '\n' ',') ./...

# 在浏览器中打开报告
go tool cover -html=backend-test-coverage.cov