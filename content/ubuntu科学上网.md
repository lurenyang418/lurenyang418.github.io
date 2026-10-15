+++
title = "在 Ubuntu 上使用 Mihomo 配置代理"
date = "2026-10-15 10:08:00+08:00"
[taxonomies]
tags = ["mihomo", "ubuntu"]
+++

> 前提
>
> 有个可用的 clash 订阅
>
> 使用 root 账号执行以下命令。
>
> 本文配置的是 HTTP/SOCKS5 代理，不是 TUN 透明代理；只有支持代理环境变量的程序会自动使用代理。

下面是这套配置的工作路径：

```mermaid
flowchart LR
    APP[支持代理的程序] --> ENV[HTTP_PROXY / HTTPS_PROXY / ALL_PROXY]
    ENV --> MIXED[Mihomo mixed-port\n127.0.0.1:7890]
    MIXED --> RULE{规则匹配}
    RULE -->|LAN / CN| DIRECT[DIRECT\n直连]
    RULE -->|其他流量| AUTO[自动选择\nurl-test 节点]
    AUTO --> PROVIDER[Clash 订阅\nproxy-provider]
    PROVIDER --> NODE[代理节点]

    SSH[SSH 本地转发\n19090] --> API[Mihomo API / Zashboard\n127.0.0.1:9090]
```

安装和启用流程如下：

```mermaid
flowchart TD
    START([开始]) --> PRE[准备 Clash 订阅]
    PRE --> DOWNLOAD[下载并安装 Mihomo]
    DOWNLOAD --> USER[创建 mihomo 用户和目录]
    USER --> CONFIG[写入 config.yml\n订阅地址 / secret / 代理组]
    CONFIG --> PERM[设置配置文件和数据目录权限]
    PERM --> SERVICE[写入 systemd 服务]
    SERVICE --> CHECK{配置校验通过?}
    CHECK -->|否| FIX[根据错误日志修正配置]
    FIX --> CONFIG
    CHECK -->|是| START_SERVICE[启动并设置开机自启]
    START_SERVICE --> ENV[配置 HTTP/SOCKS5 环境变量]
    ENV --> TEST[使用 curl 验证代理出口]
    TEST --> PANEL[SSH 转发 9090\n访问 Zashboard]
    PANEL --> DONE([完成])
```

```bash
# 按照 mihomo
cd /tmp
MIHOMO_VERSION="v1.19.32"
MIHOMO_ASSET="mihomo-linux-amd64-compatible-${MIHOMO_VERSION}.gz"
curl -fL -o mihomo.gz \
  "https://github.com/MetaCubeX/mihomo/releases/download/${MIHOMO_VERSION}/${MIHOMO_ASSET}"

# 如需升级，只修改 MIHOMO_VERSION，并根据官方 Release 页面补充校验值。
# https://github.com/MetaCubeX/mihomo/releases

gunzip -f mihomo.gz
install -m 0755 mihomo /usr/local/bin/mihomo
/usr/local/bin/mihomo -v

# 创建所需的目录
mkdir -p /etc/mihomo /var/lib/mihomo/proxy_providers
# 调整用户和权限
id mihomo >/dev/null 2>&1 || \
  useradd --system --no-create-home --shell /usr/sbin/nologin mihomo
install -d -o root   -g mihomo -m 0750 /etc/mihomo
install -d -o mihomo -g mihomo -m 0750 /var/lib/mihomo
install -d -o mihomo -g mihomo -m 0750 /var/lib/mihomo/proxy_providers
# 配置
cat > /etc/mihomo/config.yml <<'EOF'
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
ipv6: false
unified-delay: true
tcp-concurrent: true

# 控制接口只允许服务器本机访问
external-controller: 127.0.0.1:9090
# 这里要改
secret: "change-this-to-a-random-secret"

profile:
  store-selected: true
  store-fake-ip: true

proxy-providers:
  mysub:
    type: http
    # 这里要改
    url: "clash 订阅链接"
    # 这个文件名也可以改
    path: ./proxy_providers/clash.yaml
    interval: 86400
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 300
      timeout: 5000
      lazy: true

proxy-groups:
  - name: "良心节点"
    type: select
    use:
      - mysub
    proxies:
      - DIRECT

  - name: "自动选择"
    type: url-test
    use:
      - mysub
    url: https://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    lazy: true

rules:
  - GEOIP,LAN,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,自动选择

# 仅使用代理端口时，不会接管系统全部流量。
# 如果需要透明代理，还需要额外配置 tun 和 dns。
dns:
  enable: true
  ipv6: false
  enhanced-mode: fake-ip
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  fake-ip-filter:
    - "+.lan"
    - "+.local"

geo-auto-update: true
geo-update-interval: 24

geox-url:
  mmdb: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb"

# ui
external-ui: ui
external-ui-url: "https://github.com/Zephyruso/zashboard/releases/latest/download/dist-no-fonts.zip"
EOF
# 调整权限
chown root:mihomo /etc/mihomo/config.yml
chmod 0640 /etc/mihomo/config.yml

# 创建 `systemd` 服务

cat > /etc/systemd/system/mihomo.service <<'EOF'
[Unit]
Description=Mihomo Proxy Service
Documentation=https://github.com/MetaCubeX/mihomo
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mihomo
Group=mihomo
UMask=0027
WorkingDirectory=/var/lib/mihomo
ExecStart=/usr/local/bin/mihomo -d /var/lib/mihomo -f /etc/mihomo/config.yml
Restart=on-failure
RestartSec=5s
LimitNOFILE=1048576
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/lib/mihomo

[Install]
WantedBy=multi-user.target
EOF
# 刷新配置并验证
systemctl daemon-reload
/usr/local/bin/mihomo -t -d /var/lib/mihomo -f /etc/mihomo/config.yml

# 成功后设置开启启动并查看日志
systemctl enable --now mihomo
systemctl status mihomo --no-pager
journalctl -u mihomo -n 50 --no-pager

# 添加环境变量并刷新。以下内容只需执行一次，重复执行会产生重复配置。
cat >> ~/.bashrc <<'EOF'
export http_proxy="http://127.0.0.1:7890"
export https_proxy="http://127.0.0.1:7890"
export all_proxy="socks5h://127.0.0.1:7890"
export HTTP_PROXY="$http_proxy"
export HTTPS_PROXY="$https_proxy"
export ALL_PROXY="$all_proxy"
export NO_PROXY="127.0.0.1,localhost"
export no_proxy="$NO_PROXY"
EOF
source ~/.bashrc
# 验证。通常两个出口 IP 会不同，但也可能因为网络环境而相同。
curl --proxy http://127.0.0.1:7890 --connect-timeout 10 https://ifconfig.me/ip
curl --noproxy '*' --connect-timeout 10 https://ifconfig.me/ip

# 面板只监听本机 9090 端口。如需访问，可通过 SSH 转发到本地 19090 端口：
ssh -N -L 19090:127.0.0.1:9090 root@ip
```

然后在本地浏览器打开 `http://127.0.0.1:19090/ui`，并填入配置中的 `secret`。

如果首次启动后 UI 目录为空，可以手动触发 UI 下载：

```bash
curl -X POST \
  -H 'Authorization: Bearer change-this-to-a-random-secret' \
  http://127.0.0.1:9090/upgrade/ui
```
