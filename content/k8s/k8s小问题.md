+++
title = "k8s小问题"
date = "2026-06-03 08:24:27+08:00"
[taxonomies]
tags = ["k8s"]
+++


### top 命令

```shell
# 前提 k8s 开启了Metrics Server, 不然又如下错误提示
# error: Metrics API not available
# 查看 pod 
k top po <pod> -n <namespace>
# 查看 node
k top node <node>
```

### 续签问题

`~/.kube/config` 需要更新

```shell
cp /etc/kubernetes/admin.conf ~/.kube/config
# 如果是非 `root` 用户, 注意使用 `sudo`。 并修改 config 文件的所有者
sudo chown $(id -u):$(id -g) ~/.kube/config
```

### 合并 config 文件

```shell
# konfig 本身是一段脚本
k krew install konfig
k konfig import -s new-config.yaml
```

### 删除无效的 replicaset

```shell
kubectl delete $(kubectl get all | grep replicaset.apps | grep "0         0         0" | cut -d' ' -f 1)
```

### 删除异常状态的 pod

```shell
# 其中 Evicted 也可以是其他状态
kubectl get pods | grep Evicted | awk '{print $1}' | xargs kubectl delete pod
```

### 删除 pv

```shell
# 查看 pvc 的状态
kubectl describe pvc <pvc-name>
# Used By: <none>
kubectl delete pvc <pvc-name>

# 查看 pv 的状态
kubectl describe pv <pv-name>
# Retain -> Status: Released. 确定 Source.Path 中的资源不再需要
kubectl delete pv <pv-name>
```

### ingress class

k8s 有多个ingress 的情况下，最好手动指定 ingressClassName. 如果仅有一个话，可以不提供