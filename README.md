# FIU MCP Server

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![MCP Protocol](https://img.shields.io/badge/MCP-Streamable%20HTTP%20%7C%20SSE-green)](https://modelcontextprotocol.io)
[![Markets](https://img.shields.io/badge/Markets-A%E8%82%A1%20%7C%20%E6%B8%AF%E8%82%A1%20%7C%20%E7%BE%8E%E8%82%A1-orange)](#available-mcp-servers)

> 一站式金融市场数据 MCP Server — 覆盖 A 股、港股、美股的实时行情、F10 基本面、新闻舆情与量化分析数据。

[中文文档](#中文快速开始) | [English Quick Start](#english-quick-start) | [API Documentation](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNpjKCSFZ6TuOKiTNO) | [Get API Key](https://ai.szfiu.com/login)

---

## ✨ Features

- **🌏 三大市场覆盖** — A 股、港股、美股全市场数据
- **📊 F10 基本面** — 公司简况、财务报表、基础信息、基金持仓
- **📈 SDK 深度数据** — 盘口、资金流向、筹码分布、K 线图表、行业排行
- **🔍 智能代码检索** — 自然语言搜索证券代码，自动匹配市场
- **🔌 双传输协议** — 同时支持 Streamable HTTP 和 SSE
- **🤖 AI-Native** — 专为 Cherry Studio、OpenClaw 等 AI 助手设计

---

## English Quick Start

### 1. Get Your API Key

Register at [https://ai.szfiu.com/login](https://ai.szfiu.com/login) and generate a JWT token.

### 2. Configure Your MCP Client

Add the following to your MCP client configuration (e.g., Cherry Studio, Claude Desktop):

```json
{
  "mcpServers": {
    "fiu-cn-f10": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_cn_f10/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-hk-f10": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_hk_f10/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-us-f10": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_us_f10/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-toolkit": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/toolkit/"
    }
  }
}
```

### 3. Start Using

Ask your AI assistant natural questions like:
- "How did Tencent perform last quarter?"
- "Show me Kweichow Moutai's financial summary"
- "What's Apple's latest profit margin?"

> 💡 **Tip:** Add the [time MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/time) so the AI can pass accurate date parameters.

---

## 中文快速开始

### 1. 获取 API Key

前往 [https://ai.szfiu.com/login](https://ai.szfiu.com/login) 注册并生成 JWT Token。

![获取 API Key](./pic/szfiu-mcp-jwt-index.png)

### 2. 配置 MCP 客户端

#### 方式一：JSON 配置（推荐）

```json
{
  "mcpServers": {
    "fiu-cn-f10": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_cn_f10/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-hk-f10": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_hk_f10/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-us-f10": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_us_f10/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-cn-sdk": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_cn_sdk/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-hk-sdk": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_hk_sdk/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-us-sdk": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/stock_us_sdk/",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    },
    "fiu-toolkit": {
      "transport": "streamable_http",
      "url": "https://ai.szfiu.com/api/mcp/toolkit/"
    }
  }
}
```

#### 方式二：SSE 传输协议

将 URL 中的 `/api/mcp/` 替换为 `/api/mcp/sse/` 即可，例如：
```
https://ai.szfiu.com/api/mcp/sse/stock_cn_f10/
```

#### 方式三：Cherry Studio 手动添加

![Cherry Studio 添加方式](./pic/cherry-studio-add-mcp.png)

或 [通过 JSON 导入](./Cherry-Studio.md)。

### 3. 推荐 System Prompt

```
你是金融助手。
- 查询数据前，请先使用 toolkit 确认证券代码
- 使用 MCP 工具查询实时数据，分析用户问题
- 建议搭配 time MCP server 获取当前日期
```

---

## Available MCP Servers

| Server | Market | Description | Endpoint |
|--------|--------|-------------|----------|
| `stockCnF10` | A 股 | F10 基本面（公司简况、财务、基础信息） | `/api/mcp/stock_cn_f10/` |
| `stockHkF10` | 港股 | F10 基本面（公司简况、财务、基金持仓） | `/api/mcp/stock_hk_f10/` |
| `stockUsF10` | 美股 | F10 基本面（公司简况、财务、基础信息） | `/api/mcp/stock_us_f10/` |
| `stockCnSdk` | A 股 | SDK 深度数据（盘口、资金流、K 线、筹码） | `/api/mcp/stock_cn_sdk/` |
| `stockHkSdk` | 港股 | SDK 深度数据（盘口、资金流、K 线、筹码） | `/api/mcp/stock_hk_sdk/` |
| `stockUsSdk` | 美股 | SDK 深度数据（盘口、资金流、K 线、筹码） | `/api/mcp/stock_us_sdk/` |
| `szfiuToolkit` | 全市场 | 证券代码检索工具 | `/api/mcp/toolkit/` |

> 📋 **完整工具列表：**
> - [A 股 F10 工具](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNIm8zMODNTve7jgwV)
> - [港股 F10 工具](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNpjKCSFZ6TuOKiTNO)
> - [美股 F10 工具](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CN8MwG0JhsQP6m0wFm)
> - [A 股 SDK 工具](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNkjJRr16kQvuskS5l)
> - [港股 SDK 工具](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNSuAFX22uSE0M3H4P)
> - [美股 SDK 工具](https://doc.weixin.qq.com/doc/w3_AbgA3gZ5AK0CNAogSqbT4RnGImtJf)

---

## Demo Screenshots

### OpenClaw + 钉钉机器人

![OpenClaw MCP List](./演示效果/openclaw/openclaw_fiu_mcp_list.jpg)
![OpenClaw Query 1](./演示效果/openclaw/openclaw_fiu_mcp_q1.jpg)
![OpenClaw Query 2](./演示效果/openclaw/openclaw_fiu_mcp_q2_1.jpg)

### Cherry Studio — A 股

![A 股启动 MCP](./演示效果/A股-启动MCP.png)
![贵州茅台分析](./演示效果/A股-贵州茅台怎么样.png)

### Cherry Studio — 港股

![港股启动 MCP](./演示效果/港股-启动MCP.png)
![腾讯控股查询](./演示效果/港股-腾讯怎么样.png)

### Cherry Studio — 美股

![美股启动 MCP](./演示效果/美股-启动MCP.png)
![苹果利润表查询](./演示效果/美股-查询苹果公司利润表.png)

---

## ⚠️ Important Notes

1. **URL trailing slash** — All endpoint URLs must end with `/`
2. **API Key** — Replace `YOUR_API_KEY` with your actual JWT token
3. **Enable tools selectively** — Only enable the MCP servers you need
4. **Stock codes** — Use `szfiuToolkit` to look up correct security codes before querying
5. **Time awareness** — AI models may have outdated internal dates; add the [time MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/time) for accurate date parameters

---

## 🏢 About

**深圳市融聚汇信息科技有限公司**

提供全球金融市场行情数据，一站式上市公司基本面信息、新闻舆情，帮助深入研究、跟踪各类投资标的动态，以及进行指标分析和量化策略回测。

- 🌐 Website: [https://ai.szfiu.com](https://ai.szfiu.com)
- 📧 Contact: [Get in touch](https://ai.szfiu.com/login)

---

## 📄 License

MIT License
