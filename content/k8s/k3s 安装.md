+++
title = "k3s 安装"
date = "2026-06-03 08:05:05+06:00"
[taxonomies]
tags = ["k3s", "k8s"]
+++

## 安装 k3s(使用containerd)

```shell
curl -sfL https://get.k3s.io |INSTALL_K3S_EXEC='--disable servicelb --disable traefik'  sh -
# 修改端口
curl -sfL https://get.k3s.io |INSTALL_K3S_EXEC='--disable servicelb --disable traefik --https-listen-port 8443'  sh -s - --docker
```

### 配置文件位置

```txt
/etc/rancher/k3s/k3s.yaml
```

### 实际使用中可插拔组件

- Traefik (ingress)  --disable traefik (建议关闭)
- Metrics Server (指标) --disable metrics-server (建议关闭)
- servicelb(自带负载均衡) --disable servicelb (建议关闭)
- helm(包管理) --disable helm-controller  (建议关闭)
- cloud-controller --disable cloud-controller  (建议关闭)
- Local Path Provisioner(存储) --disable local-storage (建议开启)

