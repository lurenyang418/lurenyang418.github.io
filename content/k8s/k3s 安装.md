+++
title = "k3s 安装"
date = "2026-06-03 08:05:05+06:00"
updated = "2026-10-16 08:21:05+06:00"
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

- Traefik (ingress) --disable traefik
- Metrics Server (指标) --disable metrics-server
- servicelb(自带负载均衡) --disable servicelb
- helm(包管理) --disable helm-controller
- cloud-controller --disable cloud-controller
- Local Path Provisioner(存储) --disable local-storage

### 本地配置 `kubectl` 访问需要调整

```plaintext
clusters:
- cluster:
    server: https://<your-ip>:6443
    # 去掉认证, 添加下面这个
    insecure-skip-tls-verify: true
```
