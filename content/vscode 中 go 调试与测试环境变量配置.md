+++
title = "vscode 中 go 调试与测试环境变量配置"
date = "2026-05-19 15:00:00"
[taxonomies]
tags = ["go"]
+++

> 使用的 VSCode UI 交互操作
>
> 如果需要读取全局的系统环境变量, 尤其是刚在 `zsh` 或者 `bash` 中配置的, 需要重启 `VSCode`
> 

以下内容是在平时使用 `VSCode` 开发 `go` 代码时有关调试和测试的环境变量的总结

## 1. 调试(debug)

创建 `.vscode/launch.json`, 通过 `env` 直接配置或者 `envFile`  引用文件

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "main",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${workspaceFolder}/main.go",
            "envFile": "${workspaceFolder}/.env.test",
            "env": {
                "PA": "env from launch.json"
            }
        }
    ]
}

```

## 2. 测试(test)

创建 `.vscode/settings.json`, 通过 `go.testEnvVars` 直接配置或者 `go.testEnvFile` 引用文件 

```json
{
    "go.testEnvFile": "${workspaceFolder}/.env.test",
    "go.testEnvVars": {
        "PA": "env from settings.json"
    }
}
```

## 3. 建议

可以通过 `.env.test` 文件 (`gitignore` 屏蔽掉) 维护调试和测试都需要的公共环境变量, 然后在各自的 `key-value` 配置中维护自定义的部分