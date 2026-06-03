+++
title = "给 alacritty 替换 logo"
date = "2026-06-03 07:50:05+06:00"
[taxonomies]
tags = ["alacritty"]
+++

[新仓库](https://github.com/magalab/alacritty)

1. fork [原仓库](https://github.com/alacritty/alacritty)
2. 从 [logo 仓库](https://github.com/lewangdev/Alacritty.icns) 获取 logo fig. 导出 png 图片 1024*1024.png. 实际这个过程可以导出下面要用的图片集合
3. 制作 icns. 也可以使用 logo 仓库下载的
```shell
# 必须以 .iconset 结尾
mkdir tmp.iconset
sips -z 16 16 alacritty.png --out tmp.iconset/icon_16x16.png
sips -z 32 32 alacritty.png --out tmp.iconset/icon_16x16@2x.png
sips -z 32 32 alacritty.png --out tmp.iconset/icon_32x32.png
sips -z 64 64 alacritty.png --out tmp.iconset/icon_32x32@2x.png
sips -z 128 128 alacritty.png --out tmp.iconset/icon_128x128.png
sips -z 256 256 alacritty.png --out tmp.iconset/icon_128x128@2x.png
sips -z 256 256 alacritty.png --out tmp.iconset/icon_256x256.png
sips -z 512 512 alacritty.png --out tmp.iconset/icon_256x256@2x.png
sips -z 512 512 alacritty.png --out tmp.iconset/icon_512x512.png
sips -z 1024 1024 alacritty.png --out tmp.iconset/icon_512x512@2x.png

iconutil -c icns tmp.iconset -o alacritty.icns
```

1. 新增 `extra/logo/compat/alacritty-macos.png` 用于仓库展示
2. 替换 `extra/osx/Alacritty.app/Contents/Resources/alacritty.icns` 用于mac 平台的图标
3. 调整  `github actions` 的上传物料部分细节