# Toolset Reference

26 business toolsets, 104 endpoints, plus the `describe_tool` and `search` helper tools (28 MCP tools in total).

Most business toolsets take two arguments:

```json
{
  "endpoint": "<endpoint name from the table below>",
  "params": { "...": "endpoint-specific fields" }
}
```

Common field names such as `market`, `symbol`, `symbols`, `date`, `startDate`, `endDate` and `limit` are endpoint-specific: only send fields declared by that endpoint's `describe_tool` result. Anything else — `ipoType`, `connectType`, `dataType`, `holdingType` and so on — also goes in `params` when declared by the endpoint. The flat toolsets `market_overview`, `market_flow`, `market_position_cost`, `shareholding_institution`, `macro_economics` and `company_announcements` expose business fields directly under `arguments`.

Required fields are listed below. For full parameter descriptions, types, defaults and enum semantics, call `describe_tool` with `detail: "params"`.

---

## describe_tool

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `toolNames` | `string[]` | yes | Up to 5 toolset names, endpoint names or toolset keys |
| `detail` | `summary` \| `params` | no | Default `summary` returns a compact call contract; `params` adds detailed parameter descriptions and routing requirements |

```json
{ "toolNames": ["f10_financials", "get_financial_statement"], "detail": "params" }
```

---

## Quotes

### `quote_spot` — HK, US, CN, JP, GLOBAL

Security search, static profile, snapshot and extended quotes.

| Endpoint | Required |
| --- | --- |
| `get_quote` | `assetType` = `stock` \| `etf` \| `index` \| `warrant` \| `bond`, `symbols` |
| `get_security_definition` | `market` = `HK` \| `US` \| `CN`, `definitionType` = `stock_define` \| `double_counter` \| `new_stocks` |
| `get_security_profile` | `symbols` |
| `search_security` | — |

### `quote_intraday` — HK, US, CN, JP, GLOBAL

Order book, tick-by-tick trades, intraday trend.

| Endpoint | Required |
| --- | --- |
| `get_intraday_trend` | `symbol` |
| `get_mini_trend` | `symbol` |
| `get_orderbook` | `symbol` |
| `get_trade_history` | `market` = `HK` \| `US`, `historyType` = `trade`, `symbol` |
| `get_trade_statistics` | `market` = `HK` \| `US` \| `CN` \| `JP`, `statisticsType` = `overview` \| `detail` |
| `get_trades` | `symbol` |

### `quote_kline` — HK, US, CN, JP, GLOBAL

K-line, historical snapshots, return series.

| Endpoint | Required |
| --- | --- |
| `get_kline` | `assetType` = `stock` \| `index` \| `bond`, `symbol` |
| `get_jp_kline` | `symbol` or `symbols` (JP only) |
| `get_snapshot_history` | `market` = `HK` \| `US`, `historyType` = `snapshot`, `symbol` |

`period` for `get_kline`: `1m`, `3m`, `5m`, `15m`, `30m`, `60m`, `120m`, `240m`, `1d`, `1w`, `1mo`, `1q`, `1y`.
`adjust`: `none` (default), `forward`, `backward`. `limit` defaults to 100, max 500.
`get_kline` uses `date` as its single cutoff field and `limit` as the number of bars returned before that cutoff. It does not accept `startDate` or `endDate`. Use `YYYY-MM-DD` for daily or longer periods and `YYYY-MM-DD HH:mm:ss` for minute periods.

### `quote_derivatives_hk` — HK

Warrants and CBBC.

| Endpoint | Required |
| --- | --- |
| `get_hk_warrant_catalog` | `warrantType` = `issuer` \| `list` \| `list_en` \| `profile` |
| `get_hk_warrant_trading_data` | `warrantTradeType` = `history` \| `rank` \| `statistics` |
| `get_quote_extend` | `symbols` |

### `quote_us_options` — US

OPRA option chain, quotes, Greeks, rankings.

| Endpoint | Required |
| --- | --- |
| `get_us_option_chain` | `optionType` = `expiration` \| `chain` \| `symbols` \| `snapshot` \| `greeks` \| `callput_volume` |
| `get_us_option_overview` | `optionType` = `latest` \| `line` \| `etf_latest` \| `etf_line` |
| `get_us_option_quote` | `optionType` = `snapshot` \| `order` \| `batch_order` \| `trade` \| `kline` \| `trend` \| `statistics_overview` \| `statistics_detail` \| `base_info` \| `status` \| `batch_status` \| `transaction_extended` |
| `get_us_option_rankings` | `rankType` = `list` \| `statistics` \| `top10` |

---

## Market

### `market_overview` — HK, US, CN, JP

| Endpoint | Required |
| --- | --- |
| `get_market_statistics` | `market` = `HK` \| `US` \| `CN` \| `JP` |

### `market_ranking` — HK, US, CN, JP

Stock, industry, ETF, IPO, bond, broker and warrant rankings.

| Endpoint | Required |
| --- | --- |
| `get_hk_ranking` | `rankType` = `stock` \| `industry` \| `ipo` \| `broker` \| `market_premium` |
| `get_us_ranking` | `rankType` = `stock` \| `industry` \| `ipo` \| `etf` |
| `get_cn_ranking` | `rankType` = `stock` \| `industry` \| `ipo` |
| `get_jp_ranking` | `rankType` = `stock` \| `hot_stock` \| `industry` |

### `market_flow` — HK, US, CN, JP

| Endpoint | Required |
| --- | --- |
| `get_capital_flow` | `market` = `HK` \| `US` \| `CN` \| `JP`, `symbol` |

### `market_structure` — HK, US, CN, JP

| Endpoint | Required |
| --- | --- |
| `get_index_data` | `market` = `HK` \| `US` \| `CN`, `indexType` = `list` \| `quote` \| `constituent` \| `mapping` \| `capital_distribution` |
| `get_industry_data` | `market` = `HK` \| `US` \| `CN` \| `JP`, `industryType` = `list` \| `rank` \| `constituent` \| `belong_quote` |
| `get_market_microstructure` | `dataType` = `spread` \| `market_premium` \| `double_counter` \| `broker_list` |

### `market_position_cost` — HK, US

| Endpoint | Required |
| --- | --- |
| `get_position_cost` | `market` = `HK` \| `US`, `costType` = `range` \| `distribution`, `symbol` |

---

## Fundamentals (F10)

Returns structured statements, indicators and corporate events. It does not return annual-report PDFs, disclosure full text or analyst research.

### `f10_profile` — HK, US, CN

| Endpoint | Required |
| --- | --- |
| `get_company_profile` | — |
| `get_company_management` | — |
| `get_company_extra_profile` | `dataType` = `parallel` \| `extend_all` |

### `f10_financials` — HK, US, CN

| Endpoint | Required |
| --- | --- |
| `get_financial_statement` | — (`statementType` = `income` \| `balance` \| `cash`, default `income`) |
| `get_financial_indicator` | — |

**Filtering by reporting period.** Put `reportType` in `params`. Values differ by market:

- **HK** — `F` annual, `I` half-year, `P` pre-listing, `Q1` / `Q2` / `Q3` / `Q4` quarterly.
- **CN** — integers: `1` Q1, `6` interim, `9` first three quarters, `12` annual, `99` non-standard.
- **US** — `FY` annual, `I1` / `I2` half-year periods, `Q1` / `Q2` / `Q3` / `Q4` quarterly.

### `f10_business_governance` — HK, US, CN

| Endpoint | Required |
| --- | --- |
| `get_business_segment` | — |
| `get_company_action` | `actionType` = `dividends` \| `splits` \| `meeting` \| `codechange` \| `exchange_change` \| `suspension` \| `hold_change` \| `repurchase` \| `share_structure` |

---

## Shareholding

### `shareholding_structure` — HK, US, CN

| Endpoint | Required |
| --- | --- |
| `get_shareholders` | `holdingType` = `major` \| `current` \| `detail` \| `topten` |
| `get_shareholding_change` | — |

### `shareholding_institution` — US

| Endpoint | Required |
| --- | --- |
| `get_institution_holding` | `holdingType` = `detail` \| `statistics` |

### `shareholding_fund_broker` — HK, US

| Endpoint | Required |
| --- | --- |
| `get_broker_holding` | `holdingType` = `ratio` \| `detail` \| `statistics` \| `rank` \| `f10_ratio` |
| `get_short_sell` | — |

---

## Funds and Connect

### `fund_data` — Global funds

Fund endpoints do not use `market`, `symbol`, or `dataType`. Use `fund_id` or `fund_class_id`; pagination is `page` (from 0) and `page_size` (maximum 200). Call `search_funds` only when no stable fund identifier is available; once an ID is known, call the target endpoint directly.

| Endpoint | Contract |
| --- | --- |
| `search_funds` | `mode` = `search` \| `categories` \| `providers` \| `share_classes`; `share_classes` requires `fund_id` |
| `get_fund_profile` | one fund reference; `operation` = `default` \| `size` |
| `get_fund_managers` | one fund reference; `operation` = `current` \| `history` \| `bio` \| `education`; history requires both dates |
| `get_fund_distributions` | one fund reference plus `start_date` and `end_date` |
| `get_fund_terms` | one fund reference; `kind` = `fees` \| `constraints` \| `purchase` |
| `get_fund_nav` | one fund reference; `operation` = `latest` \| `history`; history requires both dates |
| `get_fund_performance` | one fund reference; `operation` = `latest` \| `custom`; custom requires both dates |
| `compare_funds` | 2-10 combined `fund_ids` / `fund_class_ids` |
| `get_fund_risk` | one fund reference; `operation` = `default` \| `rating` \| `debt` |
| `rank_funds` / `screen_funds` | optional `rank_field` and filters |
| `get_fund_holdings` | one fund reference; `operation` = `default` \| `top` \| `history`; history requires both dates |
| `get_fund_exposure` | one fund reference; `operation` = `asset` \| `sector` \| `country` |
| `get_fund_benchmark` / `get_fund_sales_markets` | one fund reference |
| `get_country_code` | required `countryName`; accepts Chinese/English names, ISO2, ISO3 and supported aliases |

### `stock_connect` — HK, CN

| Endpoint | Required |
| --- | --- |
| `get_stock_connect_data` | `connectType` (12 values, see below) |
| `get_hk_stock_connect_data` | `connectType` = `minute_flow` \| `balance` \| `cumulative_net_turnover_in` \| `cumulative_net_flow` \| `index_quote` \| `net_turnover` \| `rank_change_rate` \| `rank_net_turnover_in` \| `rank_shareholdings` \| `rank_traded` \| `shareholding_ratio` \| `turnover_flow` |
| `get_cn_stock_connect_data` | `connectType` = `balance` \| `cumulative_net_flow` \| `net_turnover` \| `quote_info` \| `rank_change_rate` \| `rank_net_turnover_in` \| `rank_shareholdings` \| `shareholding_ratio` |

`marketBoard` = `ALL` \| `SH` \| `SZ` narrows the A-share board. `cumulative_net_flow` supports `SH` / `SZ` only and requires it explicitly. `marketBoard` is independent of the top-level `market`.

---

## IPO — HK, US

Covers IPO, prospectus and filing scenarios only. It is not an announcement search for already-listed companies.

| Endpoint | Required |
| --- | --- |
| `get_hk_ipo_calendar` | `ipoType` = `calendar` \| `calendar_detail` |
| `get_hk_ipo_list` | `ipoType` = `make_new` \| `today` \| `to_be_listed` \| `listed` \| `table` \| `table_detail` |
| `get_hk_ipo_detail` | `ipoType` = `offering` \| `public_offering` \| `company_info` \| `allocation_top` \| `allocation_bottom` |
| `get_ipo_profile` | `ipoType` = `profile`, `code` |
| `get_hk_ipo_company_profile` | `ipoType` = `company_profile` \| `company_profile_new` |
| `get_hk_ipo_underwriter` | `ipoType` = `underwriter_list` \| `sponsor_list` |
| `get_hk_ipo_cornerstone_investor` | `ipoType` = `cornerstone_list` \| `cornerstone_rank` |
| `get_hk_ipo_margin_info` | `ipoType` = `margin` \| `margin_step` \| `broker_info` \| `multiple` |
| `get_hk_ipo_notice` | `ipoType` = `prospectus` \| `table_notice` |
| `get_hk_ipo_rankings` | `rankType` = `popular` \| `first_day_return` \| `sponsor` \| `underwriter` \| `cornerstone` |
| `get_hk_ipo_market_data` | `ipoMarketType` = `market_info` \| `industry_info` \| `industry_performance` \| `industry_name` |
| `get_hk_ipo_subscription_tools` | `ipoUtilityType` = `compute` \| `h5_compute` \| `amount_list` \| `broker_list` \| `lot` \| `new_stock_list` \| `subscription_list` \| `subscription_dates` |
| `get_us_ipo_list` | `ipoType` = `to_be_listed` \| `listed` \| `trend` \| `pe_ttm` |
| `get_us_ipo_detail` | `ipoType` = `stock_details` |
| `get_us_ipo_underwriter` | `ipoType` = `underwriter_performance` \| `underwriter_detail` |
| `get_us_ipo_market_data` | `ipoMarketType` = `us_market_info` \| `us_industry_performance` |
| `get_ipo_news` | `contentType` = `new_stock_info` \| `list` \| `detail` \| `hot` \| `day_rank` \| `week_rank` \| `refer` \| `relate` \| `h5_relate` |
| `get_ipo_topic` | `topicType` = `top` \| `list` \| `detail` \| `info` |
| `get_ipo_course` | `courseType` = `search` \| `hot` \| `month_rank` \| `refer` \| `relate` \| `h5_relate` \| `detail` \| `total_rank` |
| `get_ipo_tags` | `tagType` = `exist_data` \| `list` |
| `search_ipo_content` | `contentType` = `async_search` \| `search` |

---

## Bonds — GLOBAL

Bond endpoints use `market: "GLOBAL"`. Symbols may be an ISIN.

### `bond_basic`

| Endpoint | Required |
| --- | --- |
| `search_bond` | — |
| `get_bond_profile` | — |
| `get_bond_quote` | — |
| `get_bond_orderbook` | — |

### `bond_analytics`

| Endpoint | Required |
| --- | --- |
| `get_bond_rankings` | — |
| `get_bond_chart` | — |
| `get_bond_yield` | — |
| `get_bond_trading_status` | — |

---

## News — `fiu_news`, HK, US, CN, JP, GLOBAL

Covers news for listed companies. It does not cover exchange filings, disclosure full text or analyst reports.

| Endpoint | Required |
| --- | --- |
| `news_search` | `query` |
| `news_by_symbol` | `symbol` |
| `news_latest` | — |
| `news_get` | `id` |
| `news_related` | `id` |
| `news_digest` | — |

`news_search` is semantic search. `limit` defaults to 10, max 50; `hours` on `news_latest` defaults to 24, max 168. Use the endpoint schema for optional date, sorting and relevance fields.

---

## Calendar, macro data and company announcements

### `financial_calendar` — global events

| Endpoint | Required |
| --- | --- |
| `search_financial_calendar` | `keyword`, `date` |
| `get_financial_event_detail` | `id` |

`search_financial_calendar` uses `endDate` for an explicit range, or `direction` and `limit` for a rolling window. It filters with `countryTypes`, `eventTypes`, `markets` and `importanceLevels`, not the securities `market` field.

### `macro_economics` — curated macro series

| Endpoint | Required |
| --- | --- |
| `get_macro_overview` | `titleId` |

`titleId` must be one of the values returned by `describe_tool` (10, 20, 30, 40, 50, 60, 70, 80, 90, 100 or 110).

### `company_announcements` — HK, US, CN

| Endpoint | Required |
| --- | --- |
| `get_company_announcements` | `market`, `symbols` |

This flat tool uses top-level `arguments` fields. `startDate` and `endDate` are optional. Each announcement stays in the result when an attachment fails; inspect `attachmentStatus`.

---

## Reference — `reference`, HK, US, CN, JP, GLOBAL

| Endpoint | Required |
| --- | --- |
| `get_reference_data` | `referenceType` = `isin` \| `sedol` \| `trade_symbol` \| `warrant_related` \| `currency` \| `basic_symbol` \| `cik` \| `adr` \| `bond_codes` \| `yield_codes` |
| `get_symbol_mapping` | `referenceType` = `stock` \| `index` |
| `get_trading_status` | `statusType` = `trade_date` \| `session` \| `exright` \| `security` \| `delisted` \| `current` \| `bond_session` \| `yield_session` |
| `get_market_hours` | — |

Prefer a business toolset when one exists; `reference` is for code mapping and calendar lookups, not for announcement, news or research search.

---

## Shared conventions

| Field | Format |
| --- | --- |
| `market` | `HK`, `US`, `CN` (A-share), `JP`, `GLOBAL` (cross-market, currently fixed income) |
| `symbol` / `symbols` | Full suffix: `00700.hk`, `AAPL.us`, `600519.sh`, `000001.sz`, `6758.jp`; bonds accept an ISIN |
| Date/time fields | Field names are endpoint-specific. Use `describe_tool`; `get_kline` accepts only cutoff `date`, not `startDate`/`endDate` |
| `limit` | Meaning and ceiling vary by endpoint — see `describe_tool` |

Do not put `endpoint`, `token` or `Authorization` inside `params`.

## Connection baseline

- HTTPS endpoint: `https://ai.szfiu.com/api/mcp/v2`
- HTTP header: `Authorization: Bearer YOUR_API_KEY`
- npm/npx stdio adapter: `npx -y fiu-finance-mcp` with Node.js 20.18.1 or newer and `FIU_API_KEY`

## Error codes

| Code | Meaning | Fix |
| --- | --- | --- |
| `INVALID_ARGUMENT` | Type or enum mismatch | Check the value against `describe_tool detail=params` |
| `INVALID_SEMANTIC_INPUT` | A required discriminator is missing | Add the missing `*Type` field |
| `INVALID_DOWNSTREAM_ARGS` | Parameter combination rejected downstream | Check field co-dependencies |
| `UNSUPPORTED_ROUTE` | This market does not support the endpoint | Switch market or use the market-specific endpoint |
| `DOWNSTREAM_NETWORK_ERROR` | Upstream data source unreachable | Retry; if persistent, keep the `requestId` and open an issue |
