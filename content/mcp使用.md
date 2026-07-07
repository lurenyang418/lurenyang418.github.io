+++
title = "mcp实践"
date = "2026-07-07 11:01:17+08:00"
[taxonomies]
tags = ["mcp", "langchain"]
+++

1. 创建项目目录和虚拟环境
```
mkdir mcp-demo
cd mcp-demo
uv init .
uv sync
```

2. 添加依赖
```shell
uv add fastmcp langchain-mcp-adapters
```

3. 实现两个简单的 mcp server 

- 数学计算

```python
# math_server.py
from fastmcp import FastMCP

mcp = FastMCP("Math")


@mcp.tool()
def add(a: int, b: int) -> int:
    """add two number"""
    return a + b


@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two number"""
    return a * b


if __name__ == "__main__":
    # 本地调试, 远端部署推荐 streamable-http
    mcp.run(transport="stdio")
```

- 获取指定地点的天气

```python
# weather_server.py
from fastmcp import FastMCP

mcp = FastMCP("Weather")


@mcp.tool()
async def get_weather(location: str) -> str:
    """Get the weather of the given location"""
    return f"It's always sunny in {location}"


if __name__ == "__main__":
    mcp.run(transport="stdio")
```

4. 创建测试客户端

![mcp_agent](/images/mcp_agent/mcp_agent.svg)


```python
# mcp_agent.py
import asyncio

from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain_mcp_adapters.client import MultiServerMCPClient


async def main():
    client = MultiServerMCPClient(
        {
            # the server will be started automatically when the agent is created
            "math": {
                "transport": "stdio",
                "command": "python",
                "args": ["math_server.py"],
            },
            # should start weather_server.py before running this script
            "weather": {
                "transport": "streamable_http",
                "url": "http://localhost:8000/mcp",
            },
        }
    )
    tools = await client.get_tools()
    # llm = init_chat_model(
    #     model="deepseek-v4-flash",
    #     model_provider="deepseek",
    #     temperature=0,
    #     extra_body={"think": {"type": "disabled"}},
    # )
    # use qwen3.5:0.8b-mlx model from ollama for testing, the result may be not true
    llm = init_chat_model(
        model="qwen3.5:0.8b-mlx",
        model_provider="ollama",
    )

    agent = create_agent(
        model=llm,
        tools=tools,
    )
    math_response = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "What is (3 + 5) * 12?"}]}
    )
    for msg in math_response["messages"]:
        print(f"{msg.type}: {msg.content}")
    
    weather_response = await agent.ainvoke(
        {"messages": [HumanMessage("What is the weather in New York?")]}
    )
    for msg in weather_response["messages"]:
        print(f"{msg.type}: {msg.content}")


if __name__ == "__main__":
    asyncio.run(main())

```

5. 测试

```shell
# 先启动 weather server (使用的流式http 协议)
uv run weather_server.py

# 新开终端启动 client, math 的server 会随着 client 启动
uv run mcp_agent.py
```