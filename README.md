# FIU Finance MCP Server

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP](<https://img.shields.io/badge/MCP-Streamable%20HTTP-green.svg>)](https://modelcontextprotocol.io)
[![Markets](<https://img.shields.io/badge/Markets-HK%20%7C%20US%20%7C%20CN%20%7C%20IPO%20%7C%20JP-orange.svg>)](#available-toolsets)
[![Toolsets](https://img.shields.io/badge/Toolsets-26-purple.svg)](docs/toolsets.md)

> Provided by Rongjuhui, a financial information provider.Access global market quotes, news, and financial data covering Hong Kong stocks, US stocks, A-shares (China Connect), Japanese stocks, global indices, funds, and bonds. Supported data includes quotes and order books, candlestick and intraday charts, fund flow analysis, industries, concepts and investment themes, financials, financial reports, announcement feeds, corporate actions, share capital and shareholders, valuations, research reports, ETF NAVs and holdings, IPOs, bonds, options, financial news, investment and economic calendars, macroeconomic data, and searches for global security codes and international identifiers.

[English](#english-quick-start) | [中文](#中文快速开始) | [Toolset Reference](docs/toolsets.md) | [Client Setup](docs/clients.md) | [Examples](docs/examples.md)

---

## ✨ Features

- 🌏 **Five market categories, one endpoint** — HK, US, CN (A-share), IPO and JP behind a single Streamable HTTP URL. Bond calls use `market=GLOBAL`.
- 🧰 **26 toolsets, 104 endpoints** — the model selects a capability through a stable toolset contract instead of memorising 104 tool names. Most toolsets use `{ endpoint, params }`; six flat toolsets expose business fields at the top level.
- 🔎 **Self-describing** — `describe_tool` returns parameters, enums, market coverage and capability boundaries on demand, at two levels of detail.
- 📊 **Depth beyond quotes** — financial statements, shareholding structure, capital flow, position cost, IPO subscription data, OPRA option chains, financial calendars, macro data and company announcements with attachments.
- ✅ **Explicit empty results** — successful responses include `code: 0` and `resultStatus`; `empty` means the query completed but returned no business records.
- 🛡️ **Validated at the gateway** — required fields, enums and market applicability are checked before the request leaves, so bad parameters come back as an actionable error instead of an empty result.
- 🔌 **Client-agnostic** — works with Claude Code, Claude Desktop, Cherry Studio, Cursor, ChatWise and any MCP client that speaks Streamable HTTP.

---

## English Quick Start

### 1. Get your API key

Visit **https://ai.szfiu.com** and apply for an API key.

### 2. Configure your MCP client

```json
{
  "mcpServers": {
    "fiu-finance": {
      "type": "streamableHttp",
      "url": "https://ai.szfiu.com/api/mcp/v2",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Claude Code, one command:

```bash
claude mcp add --transport http fiu-finance https://ai.szfiu.com/api/mcp/v2 \
  --header "Authorization: Bearer YOUR_API_KEY"
```

Per-client instructions are in [docs/clients.md](docs/clients.md).

### 2a. Use the npm/npx stdio adapter

Clients that launch local MCP processes can use the published adapter. It requires Node.js 20.18.1 or newer:

```bash
FIU_API_KEY=YOUR_API_KEY npx -y fiu-finance-mcp
```

For a client configuration, use `command: "npx"`, `args: ["-y", "fiu-finance-mcp"]`, and pass `FIU_API_KEY` in `env`. The `--api-key` flag overrides the environment variable; `--url` can override the default HTTPS endpoint.

### 2b. Use the DeepSeek Harness bundle

This repository also ships a DeepSeek Harness bundle that injects the same stdio adapter through `@deepseek-ai/dsh-mcp-client`:

```bash
dsh plugin --profile web add github:fiu-ai/mcp-server#path:plugins/fiu-finance-mcp-dsh
```

Set `FIU_API_KEY` before starting or restarting DeepSeek Harness. The bundle exposes the current FIU catalog of 26 business toolsets, 104 endpoints and 28 MCP tools. Details are in [plugins/fiu-finance-mcp-dsh/README.md](plugins/fiu-finance-mcp-dsh/README.md).

### 3. Start asking

```text
What is Tencent (00700.hk) trading at right now?
Show me the last 60 daily candles for AAPL.
Which Hong Kong IPOs are open for subscription this week?
Pull Kweichow Moutai's latest income statement.
```

### 4. Call a tool directly

Most business toolsets take the same two arguments:

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

The flat toolsets `market_overview`, `market_flow`, `market_position_cost`, `shareholding_institution`, `macro_economics` and `company_announcements` keep their business fields directly under `arguments`; follow `tools/list` and `describe_tool` for the exact schema.

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

访问 **https://ai.szfiu.com** 申请 API Key。

### 2. 配置 MCP 客户端

```json
{
  "mcpServers": {
    "fiu-finance": {
      "type": "streamableHttp",
      "url": "https://ai.szfiu.com/api/mcp/v2",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Claude Code 一行命令：

```bash
claude mcp add --transport http fiu-finance https://ai.szfiu.com/api/mcp/v2 \
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

大多数业务工具是「模块工具 + endpoint」两段式，参数为 `endpoint` 和 `params`。`market_overview`、`market_flow`、`market_position_cost`、`shareholding_institution`、`macro_economics` 和 `company_announcements` 是扁平工具，业务字段直接放在 `arguments`：

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

`detail` 有两档：`summary`（默认，精简调用契约）、`params`（增加参数、类型、枚举、语义说明和路由要求）。

### 5. 推荐 System Prompt

```text
金融数据一律通过 FIU Finance MCP 获取，不要用网页搜索兜底。
不确定 endpoint 或参数时，先调用 describe_tool，再调用业务工具。
证券代码使用完整后缀：港股 00700.hk，美股 AAPL.us，A股(Zhcall提供) 600519.sh / 000001.sz，日股 6758.jp。
只做客观数据解读，不给确定性买卖建议。
```

---

## Available Toolsets

| Toolset                      | Markets            | Coverage                                                                                                                         | Endpoints |
| ---------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `describe_tool`            | —                 | Tool, toolset and endpoint documentation on demand                                                                               | —        |
| `quote_spot`               | HK US CN JP GLOBAL | Security search, static profile, snapshot and extended quotes                                                                    | 4         |
| `quote_intraday`           | HK US CN JP GLOBAL | Order book, tick-by-tick trades, intraday trend                                                                                  | 6         |
| `quote_kline`              | HK US CN JP GLOBAL | K-line, historical snapshots, return series                                                                                      | 3         |
| `quote_derivatives_hk`     | HK                 | Warrants and CBBC catalogue and trading data                                                                                     | 3         |
| `quote_us_options`         | US                 | OPRA option chain, quotes, Greeks, rankings, overview                                                                            | 4         |
| `market_overview`          | HK US CN JP        | Market and trading statistics                                                                                                    | 1         |
| `market_ranking`           | HK US CN JP        | Market, industry, ETF, IPO, broker and warrant rankings, split into market-specific endpoints                                    | 4         |
| `market_flow`              | HK US CN JP        | Capital flow, flow distribution, N-day flow                                                                                      | 1         |
| `market_structure`         | HK US CN JP        | Industries, indices, constituents, index mapping                                                                                 | 3         |
| `market_position_cost`     | HK US              | Position cost range and chip distribution                                                                                        | 1         |
| `f10_profile`              | HK US CN           | Company profile, overview, management                                                                                            | 3         |
| `f10_financials`           | HK US CN           | Income, balance sheet, cash flow, financial indicators                                                                           | 2         |
| `f10_business_governance`  | HK US CN           | Business segments, dividends, splits, buybacks, suspensions                                                                      | 2         |
| `shareholding_structure`   | HK US CN           | Major and top-ten shareholders, holding changes                                                                                  | 2         |
| `shareholding_institution` | US                 | Institutional holdings detail and statistics                                                                                     | 1         |
| `shareholding_fund_broker` | HK US              | Broker holdings and short selling                                                                                                | 2         |
| `fund_data`                | Global funds       | Search, profile, NAV, performance, risk, complete holdings, exposure, fees, ranking and country-code resolution                  | 16        |
| `stock_connect`            | HK CN              | Stock Connect quota, net turnover, rankings, holding ratio                                                                       | 3         |
| `ipo`                      | IPO                | IPO calendar, offering detail, profile, underwriters, cornerstones, margin, notices, subscription tools, news and content search | 21        |
| `bond_basic`               | Bond               | Bond search, profile, snapshot, extended quote, order book; use `market=GLOBAL`                                                | 4         |
| `bond_analytics`           | Bond               | Bond rankings, charts, yields, trading status; use `market=GLOBAL`                                                             | 4         |
| `fiu_news`                 | HK US CN JP GLOBAL | Semantic news search, per-symbol news, latest news, detail, related news and digest material                                     | 6         |
| `financial_calendar`       | Global             | Search financial-calendar events and retrieve event details                                                                      | 2         |
| `macro_economics`          | CN-focused         | Curated macroeconomic series by title ID                                                                                         | 1         |
| `company_announcements`    | HK US CN           | Listed-company announcements with attachment URLs or content merged into each record                                             | 1         |
| `reference`                | HK US CN JP        | ISIN, SEDOL, CIK, currency, trading sessions, symbol mapping; bond refs use `market=GLOBAL`                                    | 4         |

Full endpoint list with required parameters and enum values: **[docs/toolsets.md](docs/toolsets.md)**

---

## ⚠️ Important Notes

1. **Always send the API key.** `Authorization: Bearer YOUR_API_KEY` is required on every request. Without it the gateway returns `401 缺少认证头`; with a wrong key, `401 无效的令牌`.
2. **Never put the key in `params`.** It belongs in the HTTP header only.
3. **Use full symbol suffixes.** `00700.hk`, `AAPL.us`, `600519.sh`, `000001.sz`, `6758.jp`. Bonds accept an ISIN.
4. **Market categories are `HK`, `US`, `CN`, `IPO` and `JP`.** Bond calls use `market=GLOBAL`; ordinary equities do not.
5. **Describe before you call.** Most endpoints require a discriminator such as `ipoType`, `connectType` or `dataType`. `describe_tool` returns the legal values; guessing produces a validation error.
6. **Scope is explicit.** F10 returns structured statements and events, while `company_announcements` covers listed-company announcements and attachments. Analyst research remains out of scope; `ipo` announcements are limited to IPO/prospectus scenarios.
7. **Add a time/date MCP server** if your model needs to resolve "today" or "this week" accurately before querying.

---

## 🏢 About

Built and operated by **深圳市融聚汇信息科技有限公司** (Shenzhen Rongjuhui Information Technology Co., Ltd.).

- Service: https://ai.szfiu.com
- MCP endpoint: `https://ai.szfiu.com/api/mcp/v2`
- Issues: use the [issue templates](.github/ISSUE_TEMPLATE)

## 📄 License

[MIT](LICENSE)
