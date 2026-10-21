+++
title = "安卓打包aar"
date = "2026-10-21 08:00:00+08:00"
[taxonomies]
tags = ["安卓", "android", "aar"]
+++

## 新建项目

```mermaid
flowchart LR

A[AS新建项目] --> B[选择No Activity] --> C[填写相关信息]

```

## 新建模块

```mermaid
flowchart LR
A[File] --> B[New] --> C[New Module] -->  D[选择 Android Library] --> E[填写相关信息,和上面的同名即可]

```

## 编写相关逻辑

略

## 打包 aar

```mermaid
flowchart LR

A[选中模块目录] --> B[Build] --> C[Make Module 'xxxx']

```

打包产物在 `build/outputs/aar` 下 `*-debug.aar`, 根据文件名可知是 <kbd>debug</kbd> 版本的
如果需要 <kbd>release</kbd> 版本的, 按照如下步骤

```mermaid
flowchart LR
A[AS 右侧 gradle 选项卡] --> B[项目名称] --> C[Tasks] --> D[other] --> E[assembleRelease] --> F[执行]
```

打包产物在 `build/outputs/aar` 下 `*-release.aar`
