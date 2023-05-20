+++
title = "win 10启用ssh并配置免密"
date = "2023-05-20 11:20:00+06:00"
[taxonomies]
tags = ["win10", "ssh", "免密", "pwsh"]
+++

## 默认配置文件位置 `%PROGRAMDATA%\ssh\sshd_config`

```ini
# 确保如下开启
PubkeyAuthentication yes
AuthorizedKeysFile	.ssh/authorized_keys
PasswordAuthentication no
# 确保如下关闭
#Match Group administrators
#       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

## 启动 ssh 服务

1. 命令行

```cmd
net start sshd
```

2. 在服务中开启

## 其他机器连接

```bash
# 默认使用 cmd 终端, 很难用. 可通过 -t 指定
# -t "powershell"  win 自带的 powershell 5.1 也不太好用
# -t "pwsh" 需要额外安装 powershell 7.x
ssh-copy-id -i ~/.ssh/id_rsa.pub user@x.x.x.x -t "pwsh"
```
