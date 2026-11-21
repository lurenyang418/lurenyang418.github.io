+++
title = "ubuntu 备忘录"
date = "2023-05-20 15:00:00"
[taxonomies]
tags = ["ubuntu", "linux"]
+++

以下变更会优化使用 ubuntu linux 的使用体验

1. 换源

    ```bash
    # 阿里云源
    sed -i "s#\(archive\|security\).ubuntu.com#mirrors.aliyun.org#g" /etc/source.list
    ```

2. 时区

    ```bash
    export TZ=Asia/Shanghai
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
    echo $TZ > /etc/timezone
    ```

3. 证书问题

    ```bash
    wget --no-check-certificate
    apt install ca-certificates
    ```

4. 关闭 swap (k8s)

    ```sh
    sed -i 's@/swap@# /swap@' /etc/fstab
    rm -rf /swap.img
    ```

5. 关闭登录成功后的更新等提示内容

    ```ini
    # 注释 /etc/pam.d/login 和 /etc/pam.d/sshd 中的如下两项
    # session    optional   pam_motd.so motd=/run/motd.dynamic
    # session    optional   pam_motd.so noupdate

    # 确保 /etc/ssh/sshd_config 中如下选项
    PrintMotd: no
    ```

    ```bash
    sed -i '/pam_motd.so/ s$^$#$g' /etc/pam.d/login
    sed -i '/pam_motd.so/ s$^$#$g' /etc/pam.d/sshd
    ```

6. 卸载 cloud-init

    ```bash
    apt purge cloud-init
    rm -rf /etc/cloud /var/lib/cloud
    ```

7. 卸载 snapd

    ```bash
    systemctl stop snapd
    systemctl disable --now snapd.socket
    apt autoremove --purge snapd
    rm -rf ~/snap
    ```

8. GPG 报错

    > GPG error: The following signatures couldn't be verified because the public key is not available

    ```bash
    # 复制报错提示的密钥
    gpg --keyserver keyserver.ubuntu.com --recv A4B469963BF863CC
    gpg --export --armor A4B469963BF863CC | apt-key add
    ```

9. 通过 `ppa` 源安装最新版本

    ```bash
    # 安装 add-apt-repository
    apt install software-properties-common
    # git
    add-apt-repository ppa:git-core/ppa -y
    apt update
    apt install git
    # vim
    add-apt-repository ppa:jonathonf/vim
    apt update
    apt install vim
    # neovim
    add-apt-repository ppa:neovim-ppa/unstable
    apt update
    apt install neovim
    # 删除 ppa 源
    add-apt-repository --remove ppa:xxx/yyy

    # 安装 gcc/g++, x is version. ie. 7, 9
    add-apt-repository ppa:ubuntu-toolchain-r/test
    apt update
    apt install g++-x
    ```

10. docker 安装

    ```bash
    install -m 0755 -d /etc/apt/keyrings
    # 下载 GPG 密钥并授权
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    # 写入 APT 源
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    # 修改 docker 配置
    cat >> /etc/docker/daemon.json << EOF
    {
      "live-restore": true
    }
    EOF
    # 启动
    systemctl daemon-reload
    systemctl restart docker
    ```
