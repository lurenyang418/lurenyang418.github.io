+++
title = "alpine 备忘录"
date = "2023-05-20 14:30:00"
[taxonomies]
tags = ["alpine", "linux"]
+++

以下变更会优化使用 alpine linux 的使用体验

1. 换源

```sh
# 清华源
sed -i 's#dl-cdn.alpinelinux.org#mirror.tuna.tsinghua.edu.cn#g' /etc/apk/repositories
# 阿里云源
sed -i 's#dl-cdn.alpinelinux.org#mirrors.aliyun.com#g' /etc/apk/repositories
# 中科大源
sed -i 's#dl-cdn.alpinelinux.org#mirrors.ustc.edu.cn#g' /etc/apk/repositories
```

2. 时区

```sh
export TZ=Asia/Shanghai
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
echo $TZ > /etc/timezone
```

3. 虚拟依赖包(容器中)

```sh
# xxx 为三方包
apk --virtual .build-deps xxx

# 用完删掉
apk del .build-deps
```

4. clang 相关

```sh
apk add clang clang-extra-tools
```
