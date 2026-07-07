+++
title = "02.sql agent"
date = "2026-07-07 09:55:32+08:00"
[taxonomies]
tags = ["agent", "sql"]
+++

从 [数字媒体商店示例数据库](https://www.sqlitetutorial.net/sqlite-sample-database/) 下载数据库 `chinook`, 包含艺术家、专辑、顾客、订单等表

添加依赖
```shell
# 该依赖已归档, 但仍能使用
uv add langchain-community
```

示例代码
```python
# 02.sql_agent.py
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.utilities import SQLDatabase

llm = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="deepseek",
    temperature=0,
    extra_body={"think": {"type": "disabled"}},
)

db = SQLDatabase.from_uri("sqlite:///chinook.db")

toolkit = SQLDatabaseToolkit(db=db, llm=llm)
tools = toolkit.get_tools()

for tool in tools:
    print(f"{tool.name}: {tool.description}")


top_k = 5

system_prompt = f"""
您是旨在与SQL数据库交互的代理。
给定一个输入问题，创建一个语法正确的{db.dialect}查询来运行，
然后查看查询结果并返回答案。 除非用户
指定他们希望获得的特定数量的例子，始终限制你的
最多查询{top_k}个结果。
您可以按相关列对结果进行排序，以返回最有趣的
数据库中的示例。 永远不要查询特定表格中的所有列，
只询问给定问题的相关列。
在执行查询之前，您必须仔细检查您的查询。 如果您在
执行查询，重写查询，然后重试。
请勿对任何DML语句（插入、更新、删除、删除等）
数据库。
首先，你应该始终查看数据库中的表格，看看你
可以查询。 不要跳过这一步。
然后，您应该查询最相关的表格的模式。
"""

agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=system_prompt,
)

q = "平均而言，哪种类型的曲目最长"

for step in agent.stream(
    input={"messages": [{"role": "user", "content": q}]},
    stream_mode="values",
):
    step["messages"][-1].pretty_print()

```