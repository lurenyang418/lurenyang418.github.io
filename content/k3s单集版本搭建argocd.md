+++
title = "k3s单机版本搭建argocd"
date = "2026-07-30 16:28:34+08:00"
[taxonomies]
tags = ["k3s", "argocd"]
+++

## 前置条件

- 一台可用的 Linux 机器，建议使用 Ubuntu/CentOS/Rocky 等
- 需要 `kubectl` 可用
- 如果要使用 `argocd` CLI 登录，需先安装它
- 机器上需要能够访问 Kubernetes API

如果你还没有安装 `kubectl`，可以先安装对应版本的 CLI。

## 搭建单机 k3s

```shell
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC='--disable servicelb --disable traefik' sh -
```

安装完成后，先验证节点状态：

```shell
kubectl get nodes
```

## 安装 ArgoCD

```shell
kubectl create namespace argocd

# 加上 --server-side --force-conflicts，避免出现 CRD 注解过长的问题
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

等待安装完成后，检查相关资源：

```shell
kubectl get pods -n argocd
kubectl get svc -n argocd
```

将 ArgoCD 的 Service 调整为 `NodePort`，便于在宿主机访问：

```shell
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
kubectl get svc argocd-server -n argocd
```

获取初始管理员密码：

```shell
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

## 登录 ArgoCD UI

如果你还没有安装 `argocd` CLI，可以先安装：

```shell
# macOS
brew install argocd
```

然后执行登录：

```shell
argocd login <服务器IP>:<NodePort> --username admin --password <初始密码> --insecure
```

如果希望修改默认密码：

```shell
argocd account update-password
```

访问地址通常是：

```text
https://<服务器IP>:<NodePort>
```

## 部署示例应用 guestbook

创建一个 ArgoCD `Application` 资源：

```shell
cat > guestbook-application.yaml <<'EOF'
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
EOF
```

应用它：

```shell
kubectl apply -f guestbook-application.yaml
argocd app get guestbook
```

也可以直接查看 ArgoCD 里创建的应用：

```shell
kubectl get application -n argocd
```

查看部署结果：

```shell
kubectl get all -n guestbook
```

## 常见问题

- 如果登录失败，先确认 `argocd-server` 的 `NodePort` 是否正确暴露
- 如果看不到应用状态，先检查 `argocd` 的 Pod 是否正常运行
- 如果 `kubectl get all -n guestbook` 没有结果，说明应用还没有完全同步完成，可以稍等片刻后再查看
- 如果提示 `secret` 取不到，说明 ArgoCD 初始化还没完成，等待几分钟后再执行一次
