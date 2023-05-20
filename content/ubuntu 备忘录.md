+++
title = "ubuntu 备忘录"
date = "2023-05-20 15:00:00"
[taxonomies]
tags = ["ubuntu", "linux", "memos"]
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

6. 卸载 cloud-init

   ```bash
   apt purge cloud-init
   rm -rf /etc/cloud /var/lib/cloud
   ```

7. 卸载 snapd

   ```bash
   apt purge snapd
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

10. TBD
