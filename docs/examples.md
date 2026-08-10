# Examples

Every call below is `toolset` + `{ endpoint, params }`. Copy the JSON into the tool arguments.

Field names, enums and market coverage come from `describe_tool`; when an example does not fit your case, ask the server rather than guessing.

---

## Quotes

**Batch snapshot quote (HK)**

`quote_spot`
```json
{
  "endpoint": "get_quote",
  "params": { "market": "HK", "assetType": "stock", "symbols": ["00700.hk", "09988.hk"] }
}
```

**Search by name or code**

`quote_spot`
```json
{
  "endpoint": "search_security",
  "params": { "market": "HK", "assetType": "stock", "keyword": "腾讯", "limit": 5 }
}
```

**Static profile (US)**

`quote_spot`
```json
{
  "endpoint": "get_security_profile",
  "params": { "market": "US", "symbols": ["AAPL.us"] }
}
```

**60 daily candles (US)**

`quote_kline`
```json
{
  "endpoint": "get_kline",
  "params": { "market": "US", "assetType": "stock", "symbol": "AAPL.us", "period": "1d", "limit": 60 }
}
```

**Order book / tick trades / intraday trend (HK)**

`quote_intraday`
```json
{ "endpoint": "get_orderbook",       "params": { "market": "HK", "assetType": "stock", "symbol": "00700.hk" } }
{ "endpoint": "get_trades",          "params": { "market": "HK", "assetType": "stock", "symbol": "00700.hk", "limit": 10 } }
{ "endpoint": "get_intraday_trend",  "params": { "market": "HK", "assetType": "stock", "symbol": "00700.hk" } }
```

**HK warrant issuers**

`quote_derivatives_hk`
```json
{ "endpoint": "get_hk_warrant_catalog", "params": { "market": "HK", "warrantType": "issuer" } }
```

---

## Market

**Market statistics (HK)**

`market_overview`
```json
{ "endpoint": "get_market_statistics", "params": { "market": "HK" } }
```

**Top gainers by change rate (HK)**

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

`sortType`: `1` descending (default), `0` ascending. `rankType`: `stock`, `industry`, `ipo`, `broker`, `market_premium`, `etf`, `hot_stock`.

**Current capital flow (A-share(Zhcall))**

`market_flow`
```json
{
  "endpoint": "get_capital_flow",
  "params": { "market": "CN", "flowType": "current", "symbol": "600519.sh" }
}
```

`flowType`: `current`, `daily`, `distribution`, `index_distribution`, `totalview`.

**Industry list (A-share(Zhcall))**

`market_structure`
```json
{ "endpoint": "get_industry_data", "params": { "market": "CN", "industryType": "list" } }
```

**Profit ratio at a given price (HK)**

`market_position_cost`
```json
{
  "endpoint": "get_position_cost",
  "params": { "market": "HK", "costType": "range", "symbol": "00700.hk", "price": 480 }
}
```

`costType: "distribution"` takes `high` and `low` instead of `price`.

---

## Fundamentals

**Company profile (A-share(Zhcall))**

`f10_profile`
```json
{
  "endpoint": "get_company_profile",
  "params": { "market": "CN", "symbol": "600519.sh", "dataType": "basic" }
}
```

**Annual income statement (HK)**

`f10_financials`
```json
{
  "endpoint": "get_financial_statement",
  "params": { "market": "HK", "symbol": "00700.hk", "statementType": "income", "reportType": "F" }
}
```

**Annual balance sheet (A-share(Zhcall))**

`f10_financials`
```json
{
  "endpoint": "get_financial_statement",
  "params": { "market": "CN", "symbol": "600519.sh", "statementType": "balance", "reportType": 12 }
}
```

`reportType` encoding differs by market — HK uses letters, A-share(Zhcall) uses integers, US ignores the field. See [toolsets.md](toolsets.md#f10_financials--hk-us-cn).

**Financial indicators (A-share(Zhcall))**

`f10_financials`
```json
{ "endpoint": "get_financial_indicator", "params": { "market": "CN", "symbol": "600519.sh" } }
```

**Dividend history (HK)**

`f10_business_governance`
```json
{
  "endpoint": "get_company_action",
  "params": { "market": "HK", "symbol": "00700.hk", "actionType": "dividends" }
}
```

---

## Shareholding

**Major shareholders (HK) / top ten (A-share(Zhcall))**

`shareholding_structure`
```json
{ "endpoint": "get_shareholders", "params": { "market": "HK", "symbol": "00700.hk", "holdingType": "major" } }
{ "endpoint": "get_shareholders", "params": { "market": "CN", "symbol": "600519.sh", "holdingType": "topten" } }
```

**Holding changes (HK)**

`shareholding_structure`
```json
{ "endpoint": "get_shareholding_change", "params": { "market": "HK", "symbol": "00700.hk" } }
```

**Institutional holding statistics (US)**

`shareholding_institution`
```json
{
  "endpoint": "get_institution_holding",
  "params": { "market": "US", "symbol": "AAPL.us", "holdingType": "statistics" }
}
```

**Short selling (HK)**

`shareholding_fund_broker`
```json
{ "endpoint": "get_short_sell", "params": { "market": "HK", "symbol": "00700.hk" } }
```

---

## Funds, IPO, bonds, reference

**ETF issuers (HK)**

`fund_etf`
```json
{ "endpoint": "get_etf_data", "params": { "market": "HK", "dataType": "issuer" } }
```

**Fund NAV (HK)**

`fund_etf`
```json
{ "endpoint": "get_fund_data", "params": { "market": "HK", "symbol": "02800.hk", "dataType": "value" } }
```

**Upcoming HK listings**

`ipo`
```json
{ "endpoint": "get_hk_ipo_list", "params": { "ipoType": "to_be_listed" } }
```

`ipoType`: `make_new` (subscribing), `today`, `to_be_listed`, `listed`, `table`, `table_detail`.

**Bond search**

`bond_basic`
```json
{ "endpoint": "search_bond", "params": { "market": "GLOBAL", "keyword": "CHINA", "limit": 5 } }
```

**ISIN lookup (HK)**

`reference`
```json
{
  "endpoint": "get_reference_data",
  "params": { "market": "HK", "symbol": "00700.hk", "referenceType": "isin" }
}
```

---

## News

`fiu_news`
```json
{ "endpoint": "news_latest",          "params": { "market": "HK", "limit": 5 } }
{ "endpoint": "news_search",          "params": { "market": "CN", "query": "新能源", "limit": 10 } }
{ "endpoint": "news_by_symbol",       "params": { "market": "HK", "symbol": "00700.hk", "limit": 10 } }
{ "endpoint": "news_semantic_search", "params": { "market": "US", "query": "AI chip demand", "limit": 10 } }
```

`news_search` matches title, summary and keywords — not the article body. Use `news_semantic_search` for descriptive queries.

---

## Discovering parameters

```json
{ "toolNames": ["ipo"], "detail": "summary" }
{ "toolNames": ["get_hk_ipo_margin_info"], "detail": "params" }
{ "toolNames": ["get_hk_ipo_margin_info"], "detail": "full" }
```

- `summary` — one-line purpose, market coverage and boundaries. Up to 5 names per call.
- `params` — parameters, types, enums, required flags. Up to 5 names per call.
- `full` — expands the downstream request body. One endpoint per call; use it when a call keeps failing validation.

---

## Natural-language prompts

```text
腾讯控股现在多少钱？港股大市今天涨跌家数是多少？
帮我看 AAPL 最近 60 根日 K，顺便算一下区间涨幅。
本周港股有哪些新股在招股？保证金倍数是多少？
贵州茅台最近三年的营业收入和净利润趋势。
苹果的机构持股统计，最近一个季度有没有明显增减？
00700.hk 的十大股东和最近的持股变动。
最近 24 小时港股有什么重要新闻？
```
