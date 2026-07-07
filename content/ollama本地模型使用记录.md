+++
title = "两个本地模型"
date = "2026-07-04 14:15:12+08:00"
[taxonomies]
tags = ["ollama", "code"]
+++

> 在 mba M1 16G 可以运行的 

## 通用模型
```shell
ollama run gemma4:12b-mlx
```

## code 模型.
```shell
robit/ornith-vision:9b
```

## embedding 模型

```shell
# 0.6b 向量维度为 1024.
# 如果对效果有要求, 可以考虑 4b (2048 维) 或者 8b (4096 维度) 
# 一次性交互
ollama run qwen3-embedding:0.6b "this is a test"
# 后台运行, 通过 api 使用(openai)
curl http://localhost:11434/api/embed -d '{
  "model": "qwen3-embedding:0.6b",
  "input": "warmup",
  "keep_alive": -1
}'
```