+++
title = "mac本地embedding"
date = "2026-09-03 09:50:28+08:00"
[taxonomies]
tags = ["embedding"]
+++

## 安装 ollama

```shell
brew install ollama
brew services start ollama 
```

## 通过 curl 激活

> embedding 模型无法通过 `ollama run <model>` 的形式常驻后台

```shell
curl http://localhost:11434/api/embeddings -d '{
  "model": "qwen3-embedding:0.6b",
  "prompt": "test",
  "options": {
    "keep_alive": "9999h"
  }
}'
```

## 编程语言测试

```python
# /// script
# requires-python = ">=3.14"
# dependencies = [
#     "openai>=2.44.0",
# ]
# ///

from openai import OpenAI


def main() -> None:
    client = OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama",
    )

    resp = client.embeddings.create(
        model="qwen3-embedding:0.6b",
        input="这是一段需要向量化的文本",
    )

    vector = resp.data[0].embedding

    print(len(vector))
    print(vector[0:3])


if __name__ == "__main__":
    main()

```

运行测试

```shell
uv run embed.py
# 1024
# [-0.0211977306753397, -0.06033015251159668, -0.012153074145317078]
```
