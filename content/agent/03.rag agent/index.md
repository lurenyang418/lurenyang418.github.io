+++
title = "03.rag agent"
date = "2026-07-07 10:08:30+08:00"
[taxonomies]
tags = ["agent", "rag"]
+++

## RAG

0. RAG 类型

|    架构     | 描述                                           | 可控性 | 灵活性 | 延迟 |         适用场景          |
| :---------: | :--------------------------------------------- | :----: | :----: | :--: | :-----------------------: |
|   两步RAG   | 检索总是在生成之前，简单、可预测               |   高   |   低   |  快  |      FAQ、文档机器人      |
| Agentic RAG | LLM驱动的Agent在推理过程中决定何时以及如何检索 |   低   |   高   | 可变 | 可访问多种工具的科研助手  |
|   混合RAG   | 结合两种方式的特点，具有验证步骤               |   中   |   中   | 可变 | 特定领域具有质量验证的Q&A |


1. 两步RAG

检索步骤总是在生成步骤之前执行。这种架构简单且可预测，适用于检索相关文档是生成答案的先决条件的应用程序

![rag](./asset/rag.svg)

2. agentic rag

Agentic RAG将RAG与基于Agent的推理相结合。Agent在交互过程中逐步推理并决定何时以及如何检索信息，而不是在生成答案之前检索文档。

![agent rag](./asset/agent%20rag.svg)

```python
# webpage_retrieval_agent.py
import re

import httpx
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage
from langchain.tools import tool


@tool
def fetch_url(url: str) -> str:
    """fetch text content from a URL"""
    # resp = requests.get(url, timeout=10.0)
    resp = httpx.get(url, timeout=10.0)
    resp.raise_for_status()
    content = re.sub(r"<script.*?>.*?</script>", " ", resp.text, flags=re.DOTALL)
    content = re.sub(r"<style.*?>.*?</style>", " ", content, flags=re.DOTALL)
    content = re.sub(r"<.*?>", " ", content)
    return content


system_prompt = "Use fetch_url when you need to fetch information from a web-page; quote relevant snippets."

# llm = init_chat_model(
#     model="deepseek-v4-flash",
#     model_provider="deepseek",
#     temperature=0,
#     extra_body={"think": {"type": "disabled"}},
# )

llm = init_chat_model(
    model="qwen3.5:0.8b-mlx",
    model_provider="ollama",
)

agent = create_agent(
    model=llm,
    tools=[fetch_url],
    system_prompt=system_prompt,
)

result = agent.invoke(
    {
        "messages": [
            HumanMessage("""
阅读以下文档。 什么是RAG？ RAG架构有哪些类型？
https://docs.langchain.com/oss/python/langchain/retrieval
""")
        ]
    }
)

for msg in result["messages"]:
    print(f"{msg.type}: {msg.content}")

```

3. 混合 rag

混合RAG结合了两步RAG和Agentic RAG的特点。它引入了查询预处理、检索验证和生成后检查等中间步骤。典型组件包括：

- 查询增强：修改输入问题以提高检索质量。例如重写不清楚的查询，生成多种变体或用额外的上下文扩展查询。
- 检索验证：评估检索到的文档是否相关且充分。如果不是，系统可以细化查询并再次检索。
- 答案验证：检查生成的答案的准确性、完整性以及与源内容的一致性。如果需要，系统可以重新生成或修改答案。


## 知识库(knowledge base)

![kb](./asset/kb.svg)

从 [nke-10k-2023.pdf](https://github.com/langchain-ai/langchain/blob/v0.3/docs/docs/example_data/nke-10k-2023.pdf) 下载文件

1. 添加依赖

```shell
# pdf 处理
uv add langchain-community pypdf

# ollama 启用本地嵌入模型
curl http://localhost:11434/api/embed -d '{
  "model": "qwen3-embedding:0.6b",
  "input": "warmup",
  "keep_alive": -1
}'
```

2. 示例代码

```python
# pdf_search_engine.py
from typing import List

from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_core.runnables import chain
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# loader
loader = PyPDFLoader("nke-10k-2023.pdf")

docs = loader.load()
# print(len(docs))
# print(f"{docs[0].page_content[:200]}\n")
# print(docs[0].metadata)

# splitter
text_spliter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    add_start_index=True,
)

all_splites = text_spliter.split_documents(docs)

# embedding
embeddings = OllamaEmbeddings(
    model="qwen3-embedding:0.6b",
    # base_url="localhost:11434"
    keep_alive=-1,
)

# v1 = embeddings.embed_query(all_splites[0].page_content)
# v2 = embeddings.embed_query(all_splites[1].page_content)
# assert len(v1) == len(v2)
# print(f"Generated vectors of length {len(v1)}\n")
# print(v1[:10])

# vector store
vector_store = InMemoryVectorStore(embeddings)
ids = vector_store.add_documents(documents=all_splites)
# # test
# # query by question
# results = vector_store.similarity_search(
#     "how many distribution centers does nike have in the US",
#     k=5,
# )
# print(results[0])

# # return with score
# results = vector_store.similarity_search_with_score("What was Nike's revenue in 2023?")
# print(f"Score: {results[0]}\n{results[1]}")

# # query with embed doc
# embedding = embeddings.embed_query("How were Nike's margins impacted in 2023?")
# results = vector_store.similarity_search_by_vector(embedding)
# print(results[0])


@chain
def retriever(query: str) -> List[Document]:
    return vector_store.similarity_search(query, 1)


results = retriever.batch(
    [
        "How many distribution centers does Nike have in the US?",
        "When was Nike incorporated?",
    ]
)
print(results)
```


## 一个更复杂的例子

1. 添加依赖

```shell
uv add markdownify
```


```python
# doc_agent.py
import httpx
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage
from langchain.tools import tool
from markdownify import markdownify

ALLOWED_DOMAINS = ["https://langchain-ai.github.io/", "https://docs.langchain.com"]
LLMS_TXT = "https://langchain-ai.github.io/langgraph/llms.txt"


@tool
def fetch_documentation(url: str) -> str:
    """Fetch and convert documentation from a URL"""
    if not any(url.startswith(domain) for domain in ALLOWED_DOMAINS):
        return "Error"
    resp = httpx.get(url, timeout=10).text

    return markdownify(resp)


llms_txt_content = httpx.get(LLMS_TXT).text
system_prompt = f"""
You are an expert Python developer and technical assistant.
Your primary role is to help users with questions about LangGraph and related tools.

Instructions:

1. If a user asks a question you're unsure about—or one that likely involves API usage,
   behavior, or configuration—you MUST use the `fetch_documentation` tool to consult the relevant docs.
2. When citing documentation, summarize clearly and include relevant context from the content.
3. Do not use any URLs outside of the allowed domain.
4. If a documentation fetch fails, tell the user and proceed with your best expert understanding.

You can access official documentation from the following approved sources:

{llms_txt_content}

You MUST consult the documentation to get up to date documentation
before answering a user's question about LangGraph.

Your answers should be clear, concise, and technically accurate.
"""

# llm = init_chat_model(
#     model="deepseek-v4-flash",
#     model_provider="deepseek",
#     temperature=0,
#     extra_body={"think": {"type": "disabled"}},
# )
llm = init_chat_model(
    model="qwen3.5:0.8b-mlx",
    model_provider="ollama",
)

agent = create_agent(
    model=llm,
    tools=[fetch_documentation],
    system_prompt=system_prompt,
)

resp = agent.invoke(
    {
        "messages": [
            HumanMessage(
                content=(
                    "Write a short example of a LangGraph agent using the "
                    "prebuilt create_react_agent. The agent should be able "
                    "to look up stock pricing information."
                )
            )
        ]
    }
)

print(resp["messages"][-1].content)

```