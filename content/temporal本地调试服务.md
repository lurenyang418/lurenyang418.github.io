+++
title = "temporal本地调试服务"
date = "2026-08-05 09:58:00+08:00"
[taxonomies]
tags = ["temporal"]
+++

## Temporal 本地开发服务

Temporal Development Server 默认使用内存数据库，服务重启后数据会丢失。
本服务不启用鉴权和 TLS，仅建议用于本机开发。

### 使用 Temporal CLI

```bash
# 7233 grpc 端口
# 8233 UI 端口
temporal server start-dev --ip 0.0.0.0 --db-filename temporal.db

### 使用 docker
# any db data from cli
# chown 1000:1000 temporal.db
docker run -d --name temporal -p 7233:7233 -p 8233:8233 -v `$PWD`/temporal.db:/home/temporal/temporal.db temporalio/temporal server start-dev --ip 0.0.0.0 --db-filename /home/temporal/temporal.db
```
