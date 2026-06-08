+++
title = "rustfs搭建与使用"
date = "2026-06-08 19:39:20+08:00"
[taxonomies]
tags = ["rustfs", "minio", "s3"]
+++


## docker 拉起服务


```shell
# 先创建相关目录并调整权限(目前有些问题, 官方未完全修复)
# FATAL Server encountered an error and is shutting down: Io error: Permission denied (os error 13)
mkdir /data/rustfs/{data,logs}
chown -R 10001:10001 /data/rustfs/{data,logs}

# 其中 your-access-key 和 your-secret-key 如果不指定的话, 默认均为rustfsadmin
docker run -d \
  --name s3 \
  -p 9000:9000 \
  -p 9001:9001 \
  -e RUSTFS_ACCESS_KEY=<your-access-key> \
  -e RUSTFS_SECRET_KEY=<your-secret-key> \
  -v /data/rustfs/data:/data \
  -v /data/rustfs/logs:/logs \
  rustfs/rustfs:latest \
  /data
```

## 程序验证

各编程语言均可使用 s3 兼容的客户端进行访问和操作. 特别说明, js 语言可以使用 s3mini 这个更轻量的库
