# Examples

Most calls below are `toolset` + `{ endpoint, params }`. The flat tools `market_overview`, `market_flow`, `market_position_cost`, `shareholding_institution`, `macro_economics` and `company_announcements` keep business fields directly under `arguments`.

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
  "endpoint": "get_hk_ranking",
  "params": {
    "rankType": "stock",
    "sortField": "changeRate",
    "sortType": 1,
    "pageSize": 10
  }
}
```

`sortType`: `1` descending (default), `0` ascending. `rankType` is market-specific: HK uses `stock`, `industry`, `ipo`, `broker`, `market_premium`; US uses `stock`, `industry`, `ipo`, `etf`; CN uses `stock`, `industry`, `ipo`; JP uses `stock`, `hot_stock`, `industry`.

**Current capital flow (A-share)**

`market_flow`
```json
{
  "endpoint": "get_capital_flow",
  "params": { "market": "CN", "flowType": "current", "symbol": "600519.sh" }
}
```

`flowType`: `current`, `daily`, `distribution`, `index_distribution`, `totalview`.

**Industry list (A-share)**

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

**Company profile (A-share)**

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

**Annual balance sheet (A-share)**

`f10_financials`
```json
{
  "endpoint": "get_financial_statement",
  "params": { "market": "CN", "symbol": "600519.sh", "statementType": "balance", "reportType": 12 }
}
```

`reportType` encoding differs by market — HK and US use market-specific strings, while A-share uses integers. See [toolsets.md](toolsets.md#f10_financials--hk-us-cn).

**Financial indicators (A-share)**

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

**Major shareholders (HK) / top ten (A-share)**

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

**Search funds**

`fund_data`
```json
{ "endpoint": "search_funds", "params": { "query": "DRAM", "page": 0, "page_size": 10 } }
```

**Complete latest fund holdings**

`fund_data`
```json
{ "endpoint": "get_fund_holdings", "params": { "fund_id": "FS0000KKSG", "operation": "default", "page": 0, "page_size": 200 } }
```

**Resolve a country name to ISO codes**

`fund_data`
```json
{ "endpoint": "get_country_code", "params": { "countryName": "美国" } }
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
{ "endpoint": "news_latest",    "params": { "limit": 5 } }
{ "endpoint": "news_search",    "params": { "query": "新能源", "limit": 10 } }
{ "endpoint": "news_by_symbol", "params": { "symbol": "00700.hk", "limit": 10 } }
{ "endpoint": "news_digest",    "params": { "symbol": "AAPL.us", "limit": 10 } }
```

`news_search` is semantic search. `news_digest` returns `content_preview` for summarization rather than the full article body.

## Calendar, macro data and company announcements

```json
{ "endpoint": "search_financial_calendar", "params": { "keyword": "nonfarm payrolls", "date": "2026-10-09" } }
{ "endpoint": "get_financial_event_detail", "params": { "id": "<calendar-event-id>" } }
```

The flat tools `macro_economics` and `company_announcements` keep business fields directly under `arguments`:

```json
{ "endpoint": "get_macro_overview", "titleId": 10 }
{ "endpoint": "get_company_announcements", "market": "HK", "symbols": ["00700.hk"] }
```

---

## Discovering parameters

```json
{ "toolNames": ["ipo"], "detail": "summary" }
{ "toolNames": ["get_hk_ipo_margin_info"], "detail": "params" }
```

- `summary` — one-line purpose, market coverage and boundaries. Up to 5 names per call.
- `params` — parameters, types, enums, required flags. Up to 5 names per call.

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
