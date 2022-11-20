+++
title = "markdown 语法测试"
date = "2022-11-11 13:04:05+06:00"
[taxonomies]
tags = ["markdown"]
+++

以上为摘要

<!-- more -->

以下为正文

## 样式

"\*\*" 包裹

**粗体**

"\*" 包裹

_斜体_

## 引用

">" 开启

多个 ">" 开启嵌套

> 这是一个引用
>
> > 这是一个嵌套引用

## 列表

无序列表

- 条目 1
- 条目 2
- 条目 3

有序列表

1. Go
2. Python
3. Java

嵌套列表

- 条目 1
  1. 子条目 1
  2. 子条目 2
- 条目 2
  1. 子条目 1
  2. 子条目 2

TODO 列表

- [x] 已完成
- [ ] 待完成

## 代码高亮

```go
// demo.go
import "fmt"
func Demo(){
    fmt.Println("Demo")
}
```

```python
# demo.py
print("Demo")
```

## 公式

行内公式: $\frac{1}{7}$

行间公式:

$$ \frac{1}{7} $$
