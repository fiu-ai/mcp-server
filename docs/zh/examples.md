# 使用示例

以下所有调用均为「工具集名称 + `{ endpoint, params }`」两段式。将 JSON 复制到工具调用参数中即可使用。

字段名、枚举值和市场覆盖范围请通过 `describe_tool` 查询；当示例不满足需求时，请先询问服务端，不要猜测参数。

---

## 行情

**批量快照报价（港股）**

`quote_spot`

```json
{
  "endpoint": "get_quote",
  "params": { "market": "HK", "assetType": "stock", "symbols": ["00700.hk", "09988.hk"] }
}
```

**按名称或代码搜索**

`quote_spot`

```json
{
  "endpoint": "search_security",
  "params": { "market": "HK", "assetType": "stock", "keyword": "腾讯", "limit": 5 }
}
```

**静态概况（美股）**

`quote_spot`

```json
{
  "endpoint": "get_security_profile",
  "params": { "market": "US", "symbols": ["AAPL.us"] }
}
```

**60 根日K线（美股）**

`quote_kline`

```json
{
  "endpoint": "get_kline",
  "params": { "market": "US", "assetType": "stock", "symbol": "AAPL.us", "period": "1d", "limit": 60 }
}
```

**订单簿 / 逐笔成交 / 分时走势（港股）**

`quote_intraday`

```json
{ "endpoint": "get_orderbook",       "params": { "market": "HK", "assetType": "stock", "symbol": "00700.hk" } }
{ "endpoint": "get_trades",          "params": { "market": "HK", "assetType": "stock", "symbol": "00700.hk", "limit": 10 } }
{ "endpoint": "get_intraday_trend",  "params": { "market": "HK", "assetType": "stock", "symbol": "00700.hk" } }
```

**港股窝轮发行商列表**

`quote_derivatives_hk`

```json
{ "endpoint": "get_hk_warrant_catalog", "params": { "market": "HK", "warrantType": "issuer" } }
```

---

## 市场

**市场统计（港股）**

`market_overview`

```json
{ "endpoint": "get_market_statistics", "params": { "market": "HK" } }
```

**涨幅榜排名（港股）**

`market_ranking`

```json
{
  "endpoint": "get_rankings",
  "params": {
    "market": "HK",
    "rankType": "stock",
    "sortField": "changeRate",
    "sortType": 1,
    "pageSize": 10
  }
}
```

`sortType`：`1` 降序（默认），`0` 升序。`rankType`：`stock`（股票）、`industry`（行业）、`ipo`（新股）、`broker`（券商）、`market_premium`（AH溢价）、`etf`、`hot_stock`（热门股票）。

**当前资金流向（中华通-A股）**

`market_flow`

```json
{
  "endpoint": "get_capital_flow",
  "params": { "market": "CN", "flowType": "current", "symbol": "600519.sh" }
}
```

`flowType`：`current`（当前）、`daily`（日度）、`distribution`（分布）、`index_distribution`（指数分布）、`totalview`（总览）。

**行业列表（中华通-A股）**

`market_structure`

```json
{ "endpoint": "get_industry_data", "params": { "market": "CN", "industryType": "list" } }
```

**指定价格下的获利比例（港股）**

`market_position_cost`

```json
{
  "endpoint": "get_position_cost",
  "params": { "market": "HK", "costType": "range", "symbol": "00700.hk", "price": 480 }
}
```

`costType: "distribution"` 使用 `high` 和 `low` 替代 `price`。

---

## 基本面

**公司概况（中华通-A股）**

`f10_profile`

```json
{
  "endpoint": "get_company_profile",
  "params": { "market": "CN", "symbol": "600519.sh", "dataType": "basic" }
}
```

**年度利润表（港股）**

`f10_financials`

```json
{
  "endpoint": "get_financial_statement",
  "params": { "market": "HK", "symbol": "00700.hk", "statementType": "income", "reportType": "F" }
}
```

**年度资产负债表（中华通-A股）**

`f10_financials`

```json
{
  "endpoint": "get_financial_statement",
  "params": { "market": "CN", "symbol": "600519.sh", "statementType": "balance", "reportType": 12 }
}
```

`reportType` 编码因市场而异 — 港股使用字母，A股(中华通)使用整数，美股忽略该字段。详见[工具集参考手册](toolsets.md#f10_financials--hk-us-cn)。

**财务指标（中华通-A股）**

`f10_financials`

```json
{ "endpoint": "get_financial_indicator", "params": { "market": "CN", "symbol": "600519.sh" } }
```

**分红历史（港股）**

`f10_business_governance`

```json
{
  "endpoint": "get_company_action",
  "params": { "market": "HK", "symbol": "00700.hk", "actionType": "dividends" }
}
```

---

## 股权结构

**主要股东（港股）/ 前十大股东（中华通-A股）**

`shareholding_structure`

```json
{ "endpoint": "get_shareholders", "params": { "market": "HK", "symbol": "00700.hk", "holdingType": "major" } }
{ "endpoint": "get_shareholders", "params": { "market": "CN", "symbol": "600519.sh", "holdingType": "topten" } }
```

**持股变动（港股）**

`shareholding_structure`

```json
{ "endpoint": "get_shareholding_change", "params": { "market": "HK", "symbol": "00700.hk" } }
```

**机构持仓统计（美股）**

`shareholding_institution`

```json
{
  "endpoint": "get_institution_holding",
  "params": { "market": "US", "symbol": "AAPL.us", "holdingType": "statistics" }
}
```

**沽空数据（港股）**

`shareholding_fund_broker`

```json
{ "endpoint": "get_short_sell", "params": { "market": "HK", "symbol": "00700.hk" } }
```

---

## 基金、IPO、债券、参考数据

**ETF 发行商（港股）**

`fund_etf`

```json
{ "endpoint": "get_etf_data", "params": { "market": "HK", "dataType": "issuer" } }
```

**基金净值（港股）**

`fund_etf`

```json
{ "endpoint": "get_fund_data", "params": { "market": "HK", "symbol": "02800.hk", "dataType": "value" } }
```

**即将上市港股新股**

`ipo`

```json
{ "endpoint": "get_hk_ipo_list", "params": { "ipoType": "to_be_listed" } }
```

`ipoType`：`make_new`（正在招股）、`today`（今日）、`to_be_listed`（待上市）、`listed`（已上市）、`table`（表格）、`table_detail`（表格详情）。

**债券搜索**

`bond_basic`

```json
{ "endpoint": "search_bond", "params": { "market": "GLOBAL", "keyword": "CHINA", "limit": 5 } }
```

**ISIN 代码查询（港股）**

`reference`

```json
{
  "endpoint": "get_reference_data",
  "params": { "market": "HK", "symbol": "00700.hk", "referenceType": "isin" }
}
```

---

## 新闻

`fiu_news`

```json
{ "endpoint": "news_latest",          "params": { "market": "HK", "limit": 5 } }
{ "endpoint": "news_search",          "params": { "market": "CN", "query": "新能源", "limit": 10 } }
{ "endpoint": "news_by_symbol",       "params": { "market": "HK", "symbol": "00700.hk", "limit": 10 } }
{ "endpoint": "news_semantic_search", "params": { "market": "US", "query": "AI chip demand", "limit": 10 } }
```

`news_search` 搜索标题、摘要和关键词，不搜索正文全文。描述性查询请使用 `news_semantic_search`（语义搜索）。

---

## 参数发现

```json
{ "toolNames": ["ipo"], "detail": "summary" }
{ "toolNames": ["get_hk_ipo_margin_info"], "detail": "params" }
{ "toolNames": ["get_hk_ipo_margin_info"], "detail": "full" }
```

- `summary` — 一行用途说明、市场覆盖范围和使用边界。每次最多 5 个名称。
- `params` — 参数、类型、枚举值、必填标记。每次最多 5 个名称。
- `full` — 展开下游请求体结构。每次只能查 1 个端点；当调用持续报校验错误时使用。

---

## 自然语言提问示例

```text
腾讯控股现在多少钱？港股大市今天涨跌家数是多少？
帮我看 AAPL 最近 60 根日 K，顺便算一下区间涨幅。
本周港股有哪些新股在招股？保证金倍数是多少？
贵州茅台最近三年的营业收入和净利润趋势。
苹果的机构持股统计，最近一个季度有没有明显增减？
00700.hk 的十大股东和最近的持股变动。
最近 24 小时港股有什么重要新闻？
```
