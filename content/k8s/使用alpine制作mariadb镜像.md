+++
title = "使用alpine制作mariadb镜像"
date = "2026-06-03 08:27:16+08:00"
[taxonomies]
tags = ["docker", "mariadb"]
+++

### Dockerfile

```Dockerfile
# 基础镜像
FROM alpine:3.23

LABEL maintainer="lurenyang@outlook.com"

# 环境变量
ENV MYSQL_ROOT_PASSWORD=123456 \
    MYSQL_DATA_DIR=/var/lib/mysql

# 只安装 mariadb 服务端 + 时区（清理缓存）
RUN apk update && \
    apk add --no-cache mariadb tzdata && \
    mkdir -p ${MYSQL_DATA_DIR} /run/mysqld && \
    chown -R mysql:mysql ${MYSQL_DATA_DIR} /run/mysqld && \
    rm -rf /var/cache/apk/*

# 复制启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 数据持久化
VOLUME ["${MYSQL_DATA_DIR}"]

# 暴露端口
EXPOSE 3306

# 启动
ENTRYPOINT ["docker-entrypoint.sh"]
```

### docker-entrypoint.sh

```shell
#!/bin/sh
set -e

# 首次初始化数据库
if [ ! -d "${MYSQL_DATA_DIR}/mysql" ]; then
    echo ">> 首次启动：初始化 MariaDB..."

    # 1. 初始化数据库文件（服务端自带工具，无需客户端）
    mariadb-install-db --user=mysql --datadir=${MYSQL_DATA_DIR} --force --skip-test-db

    # 2. 关键：用服务端自带参数直接初始化 root 密码（不需要 mysql 命令！）
    # 这是纯服务端初始化方式，完美解决 mysql: not found
    mariadbd --user=mysql --datadir=${MYSQL_DATA_DIR} --bootstrap << EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
CREATE USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
GRANT ALL ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

    echo ">> 数据库初始化完成，root 密码已设置！"
fi

# 前台启动服务
echo ">> 启动 MariaDB 服务..."
exec mariadbd --user=mysql --datadir=${MYSQL_DATA_DIR} --socket=/run/mysqld/mysqld.sock --port=3306 --skip-networking=OFF
```