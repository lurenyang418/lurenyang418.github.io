+++
title = "安装和使用podman"
date = "2025-09-11 08:34:54+08:00"
[taxonomies]
tags = ["docker", "podman"]
+++

###  mac 系统
> 不好用, 尤其是M系列芯片. 不如 orbstack(大公司内部无法使用)
```zsh
brew install podman
podman machine init
podman machine start
echo "alias docker=podman >> ~/.zshrc"
```
### ubuntu 系统
> 22.04 最新的 podman 版本为 3.4.4
>  
> 24.04 最新的 podman 版本为 4.9.3
```shell
# 其中 podman-docker 用于生成 docker 别名, podman-compose 用于替换 docker-compose
apt install podman podman-compose podman-docker

# 屏蔽 `Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.`
touch /etc/containers/nodocker

# 国内更换源

cat >> /etc/containers/registries.conf  << EOF
unqualified-search-registries = ["docker.io"]

[[registry]]
prefix  = "docker.io"
location = "docker.io"          # 主源
[[registry.mirror]]
location = "docker.m.daocloud.io"   # ① 无 https://  ② 无空格
[[registry.mirror]]
location = "hub-mirror.c.163.com"
[[registry.mirror]]
location = "docker.nju.edu.cn"
EOF

# 测试 hello-world
docker run hello-world
```

podman 需要搭配 Quadlet 来实现类似 `docker --restart=always` 的功能, 因为 podman 没有 daemon 进程. 只能通过 systemd 托管

又有新的 [podlet](https://github.com/containers/podlet)


命令行警告处理

```shell
echo "export PODMAN_COMPOSE_WARNING_LOGS=false" >> ~/.zshrc
```