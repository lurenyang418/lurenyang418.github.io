+++
title = "MQTT"
date = "2026-09-02 09:12:58+08:00"
[taxonomies]
tags = ["MQTT"]
+++

## broker 推荐

1. emqx

```shell
# 18083 是 dashboard 端口. 默认密码是 admin/public
docker run -d \
    --name emqx \
    -p 1883:1883 \
    -p 8083:8083 \
    -p 8084:8084 \
    -p 8883:8883 \
    -p 18083:18083 emqx/emqx:6
```

2. nanomq

```shell
docker run -d \
    --name nanomq \
    -p 1883:1883 \
    -p 8081:8081 \
    -e NANOMQ_ALLOW_ANONYMOUS=false \
    -e NANOMQ_HTTP_SERVER_USERNAME=admin \
    -e NANOMQ_HTTP_SERVER_PASSWORD=public \
    -e NANOMQ_HTTP_SERVER__HTTP__URL=0.0.0.0 \
    emqx/nanomq:latest
```

## GUI 客户端

[MQTTX](https://github.com/emqx/MQTTX)