# 工具集参考手册

23 个业务工具集，86 个端点，外加 `describe_tool`。

每个业务工具集统一接收两个参数：

```json
{
  "endpoint": "<端点名称>",
  "params": { "...": "端点相关字段" }
}
```

`market`、`symbol`、`symbols`、`startDate`、`endDate` 和 `limit` 为各工具集通用字段。端点专属字段（如 `ipoType`、`connectType`、`dataType`、`holdingType` 等）放在 `params` 中。

以下列出各端点的必填字段。如需完整参数说明、类型、默认值和枚举含义，请调用 `describe_tool` 并指定 `detail: "params"`。

---

## describe_tool — 工具自描述

| 字段          | 类型                                  | 必填 | 说明                                                            |
| ------------- | ------------------------------------- | ---- | --------------------------------------------------------------- |
| `toolNames` | `string[]`                          | 是   | 最多 5 个工具集名称、端点名称或工具集键名                       |
| `detail`    | `summary` \| `params` \| `full` | 否   | 默认`summary`。`full` 展开下游请求结构，一次只能查 1 个端点 |

```json
{ "toolNames": ["f10_financials", "get_financial_statement"], "detail": "params" }
```

---

## 行情

### `quote_spot` — 快照行情 — HK, US, CN, JP, GLOBAL

证券搜索、静态定义、快照和扩展报价。

| 端点                        | 必填字段                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `get_quote`               | `assetType` = `stock` \| `etf` \| `index` \| `warrant` \| `bond`，`symbols`                              |
| `get_security_definition` | `market` = `HK` \| `US` \| `CN`，`definitionType` = `stock_define` \| `double_counter` \| `new_stocks` |
| `get_security_profile`    | `symbols`                                                                                                            |
| `search_security`         | —                                                                                                                     |

### `quote_intraday` — 盘中数据 — HK, US, CN, JP, GLOBAL

订单簿、逐笔成交、分时走势。

| 端点                     | 必填字段                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| `get_intraday_trend`   | `symbol`                                                                                         |
| `get_mini_trend`       | `symbol`                                                                                         |
| `get_orderbook`        | `symbol`                                                                                         |
| `get_trade_history`    | `market` = `HK` \| `US`，`historyType` = `trade`，`symbol`                             |
| `get_trade_statistics` | `market` = `HK` \| `US` \| `CN` \| `JP`，`statisticsType` = `overview` \| `detail` |
| `get_trades`           | `symbol`                                                                                         |

### `quote_kline` — K线数据 — HK, US, CN, JP, GLOBAL

K线、历史快照、收益率序列。

| 端点                     | 必填字段                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| `get_kline`            | `assetType` = `stock` \| `etf` \| `index` \| `bond`，`symbol` |
| `get_latest_kline`     | `symbols`                                                               |
| `get_snapshot_history` | `market` = `HK` \| `US`，`historyType` = `snapshot`，`symbol` |

`period`（周期）可选值：`1m`、`3m`、`5m`、`15m`、`30m`、`60m`、`120m`、`240m`、`1d`、`1w`、`1mo`、`1q`、`1y`。
`adjust`（复权）：`none`（默认，不复权）、`forward`（前复权）、`backward`（后复权）。`limit` 默认 100，最大 500。

### `quote_derivatives_hk` — 港股衍生品 — HK

窝轮（认购/认沽证）和牛熊证（CBBC）。

| 端点                            | 必填字段                                                               |
| ------------------------------- | ---------------------------------------------------------------------- |
| `get_hk_warrant_catalog`      | `warrantType` = `issuer` \| `list` \| `list_en` \| `profile` |
| `get_hk_warrant_trading_data` | `warrantTradeType` = `history` \| `rank` \| `statistics`       |
| `get_quote_extend`            | `symbols`                                                            |

### `quote_us_options` — 美股期权 — US

OPRA 期权链、报价、希腊字母、排名。

| 端点                       | 必填字段                                                                                                                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_us_option_chain`    | `optionType` = `expiration` \| `chain` \| `symbols` \| `snapshot` \| `greeks` \| `callput_volume`                                                                                                                         |
| `get_us_option_overview` | `optionType` = `latest` \| `line` \| `etf_latest` \| `etf_line`                                                                                                                                                               |
| `get_us_option_quote`    | `optionType` = `snapshot` \| `order` \| `batch_order` \| `trade` \| `kline` \| `trend` \| `statistics_overview` \| `statistics_detail` \| `base_info` \| `status` \| `batch_status` \| `transaction_extended` |
| `get_us_option_rankings` | `rankType` = `list` \| `statistics` \| `top10`                                                                                                                                                                                  |

---

## 市场

### `market_overview` — 市场概览 — HK, US, CN, JP

| 端点                      | 必填字段                                          |
| ------------------------- | ------------------------------------------------- |
| `get_market_statistics` | `market` = `HK` \| `US` \| `CN` \| `JP` |

### `market_ranking` — 市场排名 — HK, US, CN, JP

股票、行业、ETF、IPO、债券、券商和窝轮排名。

| 端点             | 必填字段                                          |
| ---------------- | ------------------------------------------------- |
| `get_rankings` | `market` = `HK` \| `US` \| `CN` \| `JP` |

### `market_flow` — 资金流向 — HK, US, CN, JP

| 端点                 | 必填字段                                                      |
| -------------------- | ------------------------------------------------------------- |
| `get_capital_flow` | `market` = `HK` \| `US` \| `CN` \| `JP`，`symbol` |

### `market_structure` — 市场结构 — HK, US, CN, JP

| 端点                          | 必填字段                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_index_data`            | `market` = `HK` \| `US` \| `CN`，`indexType` = `list` \| `quote` \| `constituent` \| `mapping` \| `capital_distribution` |
| `get_industry_data`         | `market` = `HK` \| `US` \| `CN` \| `JP`，`industryType` = `list` \| `rank` \| `constituent` \| `belong_quote`            |
| `get_market_microstructure` | `dataType` = `spread` \| `market_premium` \| `double_counter` \| `broker_list`                                                     |

### `market_position_cost` — 持仓成本 — HK, US

| 端点                  | 必填字段                                                                                |
| --------------------- | --------------------------------------------------------------------------------------- |
| `get_position_cost` | `market` = `HK` \| `US`，`costType` = `range` \| `distribution`，`symbol` |

---

## 基本面（F10）

返回结构化报表、指标和公司事件，不返回年报 PDF、公告全文或分析师研报。

### `f10_profile` — 公司概况 — HK, US, CN

| 端点                          | 必填字段                                      |
| ----------------------------- | --------------------------------------------- |
| `get_company_profile`       | —                                            |
| `get_company_management`    | —                                            |
| `get_company_extra_profile` | `dataType` = `parallel` \| `extend_all` |

### `f10_financials` — 财务报表 — HK, US, CN

| 端点                        | 必填字段                                                                         |
| --------------------------- | -------------------------------------------------------------------------------- |
| `get_financial_statement` | —（`statementType` = `income` \| `balance` \| `cash`，默认 `income`） |
| `get_financial_indicator` | —                                                                               |

**按报告期筛选。** 在 `params` 中传入 `reportType`，各市场取值不同：

- **港股（HK）** — `I` 半年报，`F` 年报，`P` 上市前，`Q1` / `Q3` / `Q4` / `Q5` 季报。无 `Q2`；绝大多数记录为 `I` 和 `F`。
- **中华通-A股（CN）** — 整数：`1` 一季报，`6` 中报，`9` 三季报，`12` 年报，`99` 非标准。
- **美股（US）** — 不支持按报告期筛选，该字段忽略。

### `f10_business_governance` — 业务与治理 — HK, US, CN

| 端点                     | 必填字段                                                                                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_business_segment` | —                                                                                                                                                                                 |
| `get_company_action`   | `actionType` = `dividends` \| `splits` \| `meeting` \| `codechange` \| `exchange_change` \| `suspension` \| `hold_change` \| `repurchase` \| `share_structure` |

---

## 股权结构

### `shareholding_structure` — 股权结构 — HK, US, CN

| 端点                        | 必填字段                                                               |
| --------------------------- | ---------------------------------------------------------------------- |
| `get_shareholders`        | `holdingType` = `major` \| `current` \| `detail` \| `topten` |
| `get_shareholding_change` | —                                                                     |

### `shareholding_institution` — 机构持仓 — US

| 端点                        | 必填字段                                       |
| --------------------------- | ---------------------------------------------- |
| `get_institution_holding` | `holdingType` = `detail` \| `statistics` |

### `shareholding_fund_broker` — 基金/券商持仓 — HK, US

| 端点                   | 必填字段                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `get_broker_holding` | `holdingType` = `ratio` \| `detail` \| `statistics` \| `rank` \| `f10_ratio` |
| `get_fund_holding`   | `holdingType` = `stock_holder` \| `fund_constituent`                               |
| `get_short_sell`     | —                                                                                       |

---

## 基金与互联互通

### `fund_etf` — 基金与ETF — HK, US, JP

| 端点                     | 必填字段                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `get_etf_data`         | `dataType` = `list` \| `issuer`（仅HK）\| `area` \| `direction` \| `type` \| `constituent` |
| `get_fund_data`        | `dataType` = `value` \| `asset` \| `sector`                                                      |
| `get_fund_performance` | `dataType` = `define` \| `quarter` \| `year`                                                     |

### `stock_connect` — 沪深港通 — HK, CN

| 端点                          | 必填字段                                                                                                                                                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_stock_connect_data`    | `connectType`（12 种取值，见下方）                                                                                                                                                                                                                                                                 |
| `get_hk_stock_connect_data` | `connectType` = `minute_flow` \| `balance` \| `cumulative_net_turnover_in` \| `cumulative_net_flow` \| `index_quote` \| `net_turnover` \| `rank_change_rate` \| `rank_net_turnover_in` \| `rank_shareholdings` \| `rank_traded` \| `shareholding_ratio` \| `turnover_flow` |
| `get_cn_stock_connect_data` | `connectType` = `balance` \| `cumulative_net_flow` \| `net_turnover` \| `quote_info` \| `rank_change_rate` \| `rank_net_turnover_in` \| `rank_shareholdings` \| `shareholding_ratio`                                                                                               |

`marketBoard` = `ALL` \| `SH` \| `SZ` 用于筛选 A 股交易板。`cumulative_net_flow` 仅支持 `SH` / `SZ` 且需显式指定。`marketBoard` 独立于顶层 `market` 字段。

---

## IPO 新股 — HK, US

仅覆盖 IPO、招股书和申报场景，不包含已上市公司公告搜索。

| 端点                                | 必填字段                                                                                                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_hk_ipo_calendar`             | `ipoType` = `calendar` \| `calendar_detail`                                                                                                                            |
| `get_hk_ipo_list`                 | `ipoType` = `make_new` \| `today` \| `to_be_listed` \| `listed` \| `table` \| `table_detail`                                                                   |
| `get_hk_ipo_detail`               | `ipoType` = `offering` \| `public_offering` \| `company_info` \| `allocation_top` \| `allocation_bottom`                                                         |
| `get_hk_ipo_company_profile`      | `ipoType` = `company_profile` \| `company_profile_new`                                                                                                                 |
| `get_hk_ipo_underwriter`          | `ipoType` = `underwriter_list` \| `sponsor_list`                                                                                                                       |
| `get_hk_ipo_cornerstone_investor` | `ipoType` = `cornerstone_list` \| `cornerstone_rank`                                                                                                                   |
| `get_hk_ipo_margin_info`          | `ipoType` = `margin` \| `margin_step` \| `broker_info` \| `multiple`                                                                                               |
| `get_hk_ipo_notice`               | `ipoType` = `prospectus` \| `table_notice`                                                                                                                             |
| `get_hk_ipo_rankings`             | `rankType` = `popular` \| `first_day_return` \| `sponsor` \| `underwriter` \| `cornerstone`                                                                      |
| `get_hk_ipo_market_data`          | `ipoMarketType` = `market_info` \| `industry_info` \| `industry_performance` \| `industry_name`                                                                    |
| `get_hk_ipo_subscription_tools`   | `ipoUtilityType` = `compute` \| `h5_compute` \| `amount_list` \| `broker_list` \| `lot` \| `new_stock_list` \| `subscription_list` \| `subscription_dates` |
| `get_us_ipo_list`                 | `ipoType` = `to_be_listed` \| `listed` \| `trend` \| `pe_ttm`                                                                                                      |
| `get_us_ipo_detail`               | `ipoType` = `stock_details`                                                                                                                                              |
| `get_us_ipo_underwriter`          | `ipoType` = `underwriter_performance` \| `underwriter_detail`                                                                                                          |
| `get_us_ipo_market_data`          | `ipoMarketType` = `us_market_info` \| `us_industry_performance`                                                                                                        |
| `get_ipo_news`                    | `contentType` = `new_stock_info` \| `list` \| `detail` \| `hot` \| `day_rank` \| `week_rank` \| `refer` \| `relate` \| `h5_relate`                       |
| `get_ipo_topic`                   | `topicType` = `top` \| `list` \| `detail` \| `info`                                                                                                                |
| `get_ipo_course`                  | `courseType` = `search` \| `hot` \| `month_rank` \| `refer` \| `relate` \| `h5_relate` \| `detail` \| `total_rank`                                         |
| `get_ipo_tags`                    | `tagType` = `exist_data` \| `list`                                                                                                                                     |
| `search_ipo_content`              | `contentType` = `async_search` \| `search`                                                                                                                             |

---

## 债券 — GLOBAL

债券端点使用 `market: "GLOBAL"`。证券代码可使用 ISIN。

### `bond_basic` — 债券基础

| 端点                   | 必填字段 |
| ---------------------- | -------- |
| `search_bond`        | —       |
| `get_bond_profile`   | —       |
| `get_bond_quote`     | —       |
| `get_bond_orderbook` | —       |

### `bond_analytics` — 债券分析

| 端点                        | 必填字段 |
| --------------------------- | -------- |
| `get_bond_rankings`       | —       |
| `get_bond_chart`          | —       |
| `get_bond_yield`          | —       |
| `get_bond_trading_status` | —       |

---

## 新闻 — `fiu_news`，HK, US, CN, JP, GLOBAL

覆盖已上市公司新闻，不包含交易所公告、公告全文或分析师研报。

| 端点                     | 必填字段                                                       |
| ------------------------ | -------------------------------------------------------------- |
| `news_latest`          | `market`                                                     |
| `news_search`          | `market`（`query` 搜索标题、摘要和关键词，不搜索正文全文） |
| `news_semantic_search` | `market`，`query`                                          |
| `news_by_symbol`       | `market`，`symbol`                                         |
| `news_get`             | `market`，`id`                                             |
| `news_related`         | `market`，`id`                                             |
| `news_count`           | `market`                                                     |
| `news_digest`          | `market`                                                     |

`limit` 默认 10，最大 50。`news_latest` 的 `hours` 默认 24，最大 168。

---

## 参考数据 — `reference`，HK, US, CN, JP, GLOBAL

| 端点                   | 必填字段                                                                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_reference_data` | `referenceType` = `isin` \| `sedol` \| `trade_symbol` \| `warrant_related` \| `currency` \| `basic_symbol` \| `cik` \| `adr` \| `bond_codes` \| `yield_codes` |
| `get_symbol_mapping` | `referenceType` = `stock` \| `index`                                                                                                                                          |
| `get_trading_status` | `statusType` = `trade_date` \| `session` \| `exright` \| `security` \| `delisted` \| `current` \| `bond_session` \| `yield_session`                               |
| `get_market_hours`   | —                                                                                                                                                                                  |

优先使用业务工具集；`reference` 用于代码映射和交易日历查询，不用于公告、新闻或研报搜索。

---

## 通用约定

| 字段                                   | 格式                                                                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `market`                             | `HK`（港股）、`US`（美股）、`CN`（中华通-A股）、`JP`（日股）、`GLOBAL`（跨市场，当前为固定收益） |
| `symbol` / `symbols`               | 完整后缀：`00700.hk`、`AAPL.us`、`600519.sh`、`000001.sz`、`6758.jp`；债券可使用 ISIN            |
| `startDate` / `endDate` / `date` | `YYYY-MM-DD`；分钟级 K 线、逐笔和盘中数据使用 `YYYY-MM-DD HH:mm:ss`                                    |
| `limit`                              | 含义和上限因端点而异，请参见`describe_tool`                                                              |

请勿将 `endpoint`、`token` 或 `Authorization` 放入 `params` 中。
