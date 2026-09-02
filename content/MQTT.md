+++
title = "MQTT"
date = "2026-09-02 09:12:58+08:00"
[taxonomies]
tags = ["MQTT"]
+++

## broker 推荐

1. [emqx](https://github.com/emqx/emqx)

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

2. [nanomq](https://github.com/nanomq/nanomq)

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

## [nats](https://github.com/nats-io/nats-server)

> 仅支持 3.1.1. 不支持 5.0 [相关说明](https://docs.nats.io/learn/mqtt/)

```shell
mkdir -p /data/nats
cat >> /data/nats/nats.conf << EOF
# nats.conf
# 启用 MQTT 并监听默认的 1883 端口
mqtt {
    port: 1883

    # 【生产环境建议】启用认证，设置用户名和密码
    # authorization {
    #     username: "your_mqtt_user"
    #     password: "your_mqtt_password"
    # }
}

# 启用 JetStream 以获得持久化消息能力，这对 MQTT QoS 1/2 很重要
jetstream {
    store_dir: /data/jetstream
}

# 监控端口 (可选)
http_port: 8222
EOF

# 直接覆盖默认的配置文件
docker run -d \
    --name nats \
    -p 1883:1883 \
    -p 4222:4222 \
    -v /data/nats/nats.conf:/etc/nats/nats-server.conf:ro \
    nats:2-alpine
```


## GUI 客户端

[MQTTX](https://github.com/emqx/MQTTX)