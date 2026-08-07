# FIU Finance MCP Server

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Streamable%20HTTP-green.svg)](https://modelcontextprotocol.io)
[![Markets](https://img.shields.io/badge/Markets-HK%20%7C%20US%20%7C%20CN%20%7C%20IPO%20%7C%20JP-orange.svg)](#available-toolsets)
[![Toolsets](https://img.shields.io/badge/Toolsets-23-purple.svg)](docs/toolsets.md)

> One MCP endpoint for Hong Kong, US, A-share, Japan and global fixed-income market data — quotes, order book, K-line, fundamentals, shareholding, IPO, ETF, options, news and reference data.

[English](#english-quick-start) | [中文](#中文快速开始) | [Toolset Reference](docs/toolsets.md) | [Client Setup](docs/clients.md) | [Examples](docs/examples.md)

---

## ✨ Features

- 🌏 **Five markets, one endpoint** — HK, US, CN (A-share), JP and global bonds behind a single Streamable HTTP URL.
- 🧰 **23 toolsets, 86 endpoints** — each toolset takes `{ endpoint, params }`, so the model picks a capability instead of memorising 86 tool names.
- 🔎 **Self-describing** — `describe_tool` returns parameters, enums, market coverage and capability boundaries on demand, at three levels of detail.
- 📊 **Depth beyond quotes** — financial statements, shareholding structure, capital flow, position cost, IPO subscription data and OPRA option chains.
- 🛡️ **Validated at the gateway** — required fields, enums and market applicability are checked before the request leaves, so bad parameters come back as an actionable error instead of an empty result.
- 🔌 **Client-agnostic** — works with Claude Code, Claude Desktop, Cherry Studio, Cursor, ChatWise and any MCP client that speaks Streamable HTTP.

---

## English Quick Start

### 1. Get your API key

Visit **http://ai.szfiu.com** and apply for an API key.

### 2. Configure your MCP client

```json
{
  "mcpServers": {
    "fiu-finance": {
      "type": "streamableHttp",
      "url": "http://ai.szfiu.com/api/mcp/v2",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Claude Code, one command:

```bash
claude mcp add --transport http fiu-finance http://ai.szfiu.com/api/mcp/v2 \
  --header "Authorization: Bearer YOUR_API_KEY"
```

Per-client instructions are in [docs/clients.md](docs/clients.md).

### 3. Start asking

```text
What is Tencent (00700.hk) trading at right now?
Show me the last 60 daily candles for AAPL.
Which Hong Kong IPOs are open for subscription this week?
Pull Kweichow Moutai's latest income statement.
```

### 4. Call a tool directly

Every business toolset takes the same two arguments:

```json
{
  "endpoint": "get_quote",
  "params": {
    "market": "HK",
    "assetType": "stock",
    "symbols": ["00700.hk"]
  }
}
```

When you are unsure which `endpoint` or which fields apply, ask the server first:

```json
{
  "toolNames": ["quote_kline", "get_kline"],
  "detail": "params"
}
```

---

## 中文快速开始

### 1. 获取 API Key

访问 **http://ai.szfiu.com** 申请 API Key。

### 2. 配置 MCP 客户端

```json
{
  "mcpServers": {
    "fiu-finance": {
      "type": "streamableHttp",
      "url": "http://ai.szfiu.com/api/mcp/v2",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Claude Code 一行命令：

```bash
claude mcp add --transport http fiu-finance http://ai.szfiu.com/api/mcp/v2 \
  --header "Authorization: Bearer YOUR_API_KEY"
```

各客户端的配置位置见 [docs/clients.md](docs/clients.md)。

### 3. 直接提问

```text
腾讯控股现在多少钱？
帮我看 AAPL 最近 60 根日 K。
本周港股有哪些新股在招股？
贵州茅台最新一期利润表。
```

### 4. 调用方式

业务工具统一是「模块工具 + endpoint」两段式，参数固定为 `endpoint` 和 `params`：

```json
{
  "endpoint": "get_financial_statement",
  "params": {
    "market": "HK",
    "symbol": "00700.hk",
    "statementType": "income"
  }
}
```

不确定用哪个 endpoint、有哪些字段时，先问 `describe_tool`：

```json
{
  "toolNames": ["f10_financials", "get_financial_statement"],
  "detail": "params"
}
```

`detail` 有三档：`summary`（默认，精简摘要）、`params`（含参数、类型、枚举）、`full`（展开下游请求结构，一次只能查 1 个 endpoint）。

### 5. 推荐 System Prompt

```text
金融数据一律通过 FIU Finance MCP 获取，不要用网页搜索兜底。
不确定 endpoint 或参数时，先调用 describe_tool，再调用业务工具。
证券代码使用完整后缀：港股 00700.hk，美股 AAPL.us，A股 600519.sh / 000001.sz，日股 6758.jp。
只做客观数据解读，不给确定性买卖建议。
```

---

## Available Toolsets

| Toolset | Markets | Coverage | Endpoints |
| --- | --- | --- | --- |
| `describe_tool` | — | Tool, toolset and endpoint documentation on demand | — |
| `quote_spot` | HK US CN JP GLOBAL | Security search, static profile, snapshot and extended quotes | 4 |
| `quote_intraday` | HK US CN JP GLOBAL | Order book, tick-by-tick trades, intraday trend | 6 |
| `quote_kline` | HK US CN JP GLOBAL | K-line, historical snapshots, return series | 3 |
| `quote_derivatives_hk` | HK | Warrants and CBBC catalogue and trading data | 3 |
| `quote_us_options` | US | OPRA option chain, quotes, Greeks, rankings, overview | 4 |
| `market_overview` | HK US CN JP | Market and trading statistics | 1 |
| `market_ranking` | HK US CN JP | Stock, industry, ETF, IPO, bond, broker and warrant rankings | 1 |
| `market_flow` | HK US CN JP | Capital flow, flow distribution, N-day flow | 1 |
| `market_structure` | HK US CN JP | Industries, indices, constituents, index mapping | 3 |
| `market_position_cost` | HK US | Position cost range and chip distribution | 1 |
| `f10_profile` | HK US CN | Company profile, overview, management | 3 |
| `f10_financials` | HK US CN | Income, balance sheet, cash flow, financial indicators | 2 |
| `f10_business_governance` | HK US CN | Business segments, dividends, splits, buybacks, suspensions | 2 |
| `shareholding_structure` | HK US CN | Major and top-ten shareholders, holding changes | 2 |
| `shareholding_institution` | US | Institutional holdings detail and statistics | 1 |
| `shareholding_fund_broker` | HK US | Fund holdings, broker holdings, short selling | 3 |
| `fund_etf` | HK US JP | Fund NAV, assets, performance, ETF list and constituents | 3 |
| `stock_connect` | HK CN | Stock Connect quota, net turnover, rankings, holding ratio | 3 |
| `ipo` | HK US | IPO calendar, offering detail, underwriters, cornerstones, margin, notices | 20 |
| `bond_basic` | GLOBAL | Bond search, profile, snapshot, extended quote, order book | 4 |
| `bond_analytics` | GLOBAL | Bond rankings, charts, yields, trading status | 4 |
| `fiu_news` | HK US CN JP GLOBAL | News search, semantic search, per-symbol news, detail, statistics | 8 |
| `reference` | HK US CN JP GLOBAL | ISIN, SEDOL, CIK, currency, trading sessions, symbol mapping | 4 |

Full endpoint list with required parameters and enum values: **[docs/toolsets.md](docs/toolsets.md)**

---

## ⚠️ Important Notes

1. **Always send the API key.** `Authorization: Bearer YOUR_API_KEY` is required on every request. Without it the gateway returns `401 缺少认证头`; with a wrong key, `401 无效的令牌`.
2. **Never put the key in `params`.** It belongs in the HTTP header only.
3. **Use full symbol suffixes.** `00700.hk`, `AAPL.us`, `600519.sh`, `000001.sz`, `6758.jp`. Bonds accept an ISIN.
4. **`CN` means the A-share market; `GLOBAL` does not.** `GLOBAL` routes to cross-market data — currently fixed income. Do not use `GLOBAL` for ordinary equities.
5. **Describe before you call.** Most endpoints require a discriminator such as `ipoType`, `connectType` or `dataType`. `describe_tool` returns the legal values; guessing produces a validation error.
6. **Announcements and research reports are out of scope.** F10 returns structured statements and events, not annual-report PDFs, disclosure full text or analyst reports. `fiu_news` covers news, not filings.
7. **Add a time/date MCP server** if your model needs to resolve "today" or "this week" accurately before querying.

---

## 🏢 About

Built and operated by **深圳市融聚汇信息科技有限公司** (Shenzhen Rongjuhui Information Technology Co., Ltd.).

- Service: http://ai.szfiu.com
- MCP endpoint: `http://ai.szfiu.com/api/mcp/v2`
- Issues: use the [issue templates](.github/ISSUE_TEMPLATE)

## 📄 License

[MIT](LICENSE)
