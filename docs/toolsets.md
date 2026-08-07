# Toolset Reference

23 business toolsets, 86 endpoints, plus `describe_tool`.

Every business toolset takes exactly two arguments:

```json
{
  "endpoint": "<endpoint name from the table below>",
  "params": { "...": "endpoint-specific fields" }
}
```

`market`, `symbol`, `symbols`, `startDate`, `endDate` and `limit` are shared across toolsets. Anything endpoint-specific — `ipoType`, `connectType`, `dataType`, `holdingType` and so on — goes in `params` alongside them.

Required fields are listed below. For full parameter descriptions, types, defaults and enum semantics, call `describe_tool` with `detail: "params"`.

---

## describe_tool

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `toolNames` | `string[]` | yes | Up to 5 toolset names, endpoint names or toolset keys |
| `detail` | `summary` \| `params` \| `full` | no | Default `summary`. `full` expands downstream request bodies and accepts 1 endpoint only |

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
| `get_kline` | `assetType` = `stock` \| `etf` \| `index` \| `bond`, `symbol` |
| `get_latest_kline` | `symbols` |
| `get_snapshot_history` | `market` = `HK` \| `US`, `historyType` = `snapshot`, `symbol` |

`period` for `get_kline`: `1m`, `3m`, `5m`, `15m`, `30m`, `60m`, `120m`, `240m`, `1d`, `1w`, `1mo`, `1q`, `1y`.
`adjust`: `none` (default), `forward`, `backward`. `limit` defaults to 100, max 500.

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
| `get_rankings` | `market` = `HK` \| `US` \| `CN` \| `JP` |

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

- **HK** — `I` half-year, `F` annual, `P` pre-listing, `Q1` / `Q3` / `Q4` / `Q5` quarterly. There is no `Q2`; the vast majority of records are `I` and `F`.
- **CN** — integers: `1` Q1, `6` interim, `9` first three quarters, `12` annual, `99` non-standard.
- **US** — period filtering is not supported; the field is ignored.

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
| `get_fund_holding` | `holdingType` = `stock_holder` \| `fund_constituent` |
| `get_short_sell` | — |

---

## Funds and Connect

### `fund_etf` — HK, US, JP

| Endpoint | Required |
| --- | --- |
| `get_etf_data` | `dataType` = `list` \| `issuer` (HK only) \| `area` \| `direction` \| `type` \| `constituent` |
| `get_fund_data` | `dataType` = `value` \| `asset` \| `sector` |
| `get_fund_performance` | `dataType` = `define` \| `quarter` \| `year` |

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
| `news_latest` | `market` |
| `news_search` | `market` (`query` searches title, summary and keywords — not article body) |
| `news_semantic_search` | `market`, `query` |
| `news_by_symbol` | `market`, `symbol` |
| `news_get` | `market`, `id` |
| `news_related` | `market`, `id` |
| `news_count` | `market` |
| `news_digest` | `market` |

`limit` defaults to 10, max 50. `hours` on `news_latest` defaults to 24, max 168.

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
| `startDate` / `endDate` / `date` | `YYYY-MM-DD`; minute-level K-line, ticks and intraday use `YYYY-MM-DD HH:mm:ss` |
| `limit` | Meaning and ceiling vary by endpoint — see `describe_tool` |

Do not put `endpoint`, `token` or `Authorization` inside `params`.
