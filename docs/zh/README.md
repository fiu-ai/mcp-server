# 融聚汇FIU MCP服务

> 覆盖五大金融市场，26 项工具集一站获取

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP](<https://img.shields.io/badge/MCP-Streamable%20HTTP-green.svg>)](https://modelcontextprotocol.io)
[![Markets](<https://img.shields.io/badge/Markets-HK%20%7C%20US%20%7C%20CN%20%7C%20IPO%20%7C%20JP-orange.svg>)](#功能工具)
[![Toolsets](https://img.shields.io/badge/Toolsets-26-purple.svg)](#功能工具)

---

## 什么是融聚汇MCP 服务？

FIU Finance MCP Server 是深圳市融聚汇信息科技有限公司推出的金融市场数据 MCP 服务。通过 Streamable HTTP 端点，为 AI 模型提供港股、美股、A股（中华通）、日股、IPO 及全球基金数据，覆盖 100 个端点，支持工具自描述能力，让 AI 精准调用所需数据。

业务工具统一返回三态：成功响应包含 `code=0` 和 `resultStatus`，其中 `ok` 表示有数据，`empty` 表示调用成功但无业务数据并附带 `emptyReason`；参数错误和下游故障通过 MCP `isError=true` 返回，错误正文包含 `resultStatus=error`。状态信封不生成 `retrievedAt` 或 `failedAt`，所有工具的成功和错误响应均不返回 `raw` 字段。

### 核心能力

- **五大市场覆盖**：港股 / 美股 / A股（中华通）/ 日股 / IPO
- **26 项工具集**：实时行情、K线、财务报表、股权结构、资金流向、期权链、ETF、债券、新闻资讯、财经日历、宏观经济等
- **工具自描述**：内置 `describe_tool` 能力，AI 模型可自行查询任意工具的参数、枚举值与适用市场
- **Streamable HTTP 协议**：标准 MCP 协议，兼容主流 AI 客户端

---

## 工具列表

本服务提供 26 项金融数据工具，每项工具包含多个端点，共计 100+ 个端点。

`market_overview`、`market_flow`、`market_position_cost`、`shareholding_institution`、`macro_economics`、`company_announcements` 直接在顶层填写 `endpoint` 和业务字段。`market_ranking` 顶层仅保留 `endpoint` 和 `params`，业务字段填写在 `params` 中。`describe_tool` 按对应工具的结构提供调用示例。

例如调用 `market_flow`：

```json
{"endpoint":"get_capital_flow","market":"HK","symbol":"00700.hk","flowType":"current"}
```

字段类型、完整枚举、默认值及条件必填规则，以工具的公开参数定义和 `describe_tool` 返回内容为准。

### 1. describe_tool — 工具自描述

帮助 AI 模型在调用前了解任意工具或端点的参数、枚举值、适用市场范围。支持两级详细度：`summary`（默认紧凑调用契约，含参数类型、必填条件、完整枚举和调用位置）、`params`（增加语义说明和有效组合）。已知 endpoint 时可直接查询其完整参数。

**输入参数**

| 参数           | 类型     | 必填 | 说明                                                                                     |
| -------------- | -------- | ---- | ---------------------------------------------------------------------------------------- |
| `toolNames`  | string[] | 二选一 | 需要查询的工具集或端点名称，最多 5 个；优先使用此字段。 |
| `toolName`   | string   | 二选一 | 单个工具集或端点名称；未填写 toolNames 时使用。 |
| `detail`     | enum     | 否   | 返回详细程度：`summary` / `params`，默认 `summary`                                 |

**使用示例**

> "帮我查看 get_kline 和 get_financial_statement 这两个端点需要哪些参数"

---

### 元工具：search — 证券代码搜索

根据公司名称、证券代码或部分关键词搜索证券标的。适用于用户只提供名称、代码片段，或需要先解析标准证券代码的场景；已知完整 `symbol` 时可直接调用对应业务工具。

**输入参数**

| 参数    | 类型   | 必填 | 说明                                                                                                                                                          |
| ------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | string | 是   | 非空搜索关键词，支持公司名称、证券代码、带`.hk` / `.us` / `.sh` / `.sz` / `.jp` 后缀的完整代码或部分关键词，例如 `腾讯`、`00700`、`AAPL.us`。 |

**返回说明**

返回匹配标的列表，`symbol` 会带市场后缀，可直接作为行情、财务、新闻等工具的入参。无匹配时返回 `resultStatus=empty`、`emptyReason=NO_MATCHING_DATA`；参数错误或服务异常返回错误结果。

**使用示例**

> "搜索腾讯的证券代码" / "查找 AAPL.us 对应的美股标的"

---

### 2. quote_spot — 证券搜索与快照行情

证券搜索、静态定义、快照行情与扩展报价。支持股票、ETF、指数、权证、债券等多资产类型的实时价格查询，以及证券代码定义、双重柜台、新股列表等静态数据。股票扩展行情支持港股、美股、A股和日股。

`get_quote` 的基础行情和扩展行情返回紧凑表：`columns` 是英文字段名，`columnNames` 是逐列对应的中文名，`rows[*][i]` 对应 `columns[i]`。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                       |
| ------------ | ------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_quote` / `get_security_definition` / `get_security_profile` / `search_security`                                                               |
| `params`   | object | 是   | 包含`market`（HK/US/CN/JP/GLOBAL）、`assetType`（stock/etf/index/warrant/bond）、`symbols`（证券代码数组）、`quoteType`（basic=基础行情、extended=扩展行情）、`timeMode`（0=实时、1=延时，默认 0）等 |

日股扩展行情示例：`{"endpoint":"get_quote","params":{"market":"JP","assetType":"stock","symbols":["6758.jp","7203.jp"],"quoteType":"extended","timeMode":0}}`。

日股扩展行情提供委比、流通市值、股息率、每股盈利、市盈率等字段的中文列名。同批证券均为空的字段不返回（包括 `null`、缺失值、空字符串及纯空白字符串）；某列只要有一个非空值就保留，其他行对应位置用 `null` 补齐，保持 `columns/columnNames/rows` 对齐。`0` 和 `false` 不作为空值删除。

**使用示例**

> "腾讯控股现在多少钱？帮我查一下 00700.hk、AAPL.us 和 600519.sh 的最新报价"

---

### 3. quote_intraday — 盘中实时数据

`get_trade_statistics` 的 JP `overview` 查询必须提供 `symbol`；`date` 格式为 `YYYY-MM-DD`，省略时查询日本当地当天。非交易日可能无数据，查询历史成交请指定交易日期。`type` 为 0=主买、1=主卖、2=中性盘、3=主买和主卖、4=全部，默认 4。

订单簿（买卖盘）、逐笔成交记录、分时走势图、迷你走势图、交易统计。覆盖港股、美股、A股（中华通）、日股，提供从毫秒级逐笔到分钟级趋势的完整盘中数据。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_intraday_trend` / `get_mini_trend` / `get_orderbook` / `get_trade_history` / `get_trade_statistics` / `get_trades` |
| `params`   | object | 是   | 包含`market`、`symbol`、`historyType`（trade）、`statisticsType`（overview/detail）等                                       |

**使用示例**

> "帮我看看 00700.hk 当前的买卖盘口深度" / "展示 AAPL 今天的分时走势图"

---

### 4. quote_kline — K 线数据

`get_kline` 支持 1 分钟到年线的全周期 K 线，前复权/后复权/不复权，单次最多获取 500 根 K 线，当前明确覆盖股票、指数、债券；ETF 需先确认 endpoint。`get_jp_kline` 查询日股最近若干根 K 线，支持批量证券；历史快照使用 `get_snapshot_history`。

`get_kline` 返回紧凑表：`columns` 是英文字段名，`columnNames` 是逐列对应的中文名，`rows[*][i]` 对应 `columns[i]`。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                                                                                                                  |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_kline` / `get_jp_kline` / `get_snapshot_history` |
| `params`   | object | 是   | `get_kline` 包含 `assetType`（stock/index/bond）、`symbol`、`period`（1m/3m/5m/15m/30m/60m/120m/240m/1d/1w/1mo/1q/1y）、截止日期 `date`、`adjust`（none/forward/backward）、`limit`（默认 100，1~500 的整数）。 |

`get_kline` 的所有周期均接受 `date=YYYY-MM-DD`；分钟 K 也可指定 `YYYY-MM-DD HH:mm:ss`，仅传日期表示截至当天 23:59:59（自然日结束，并非交易所收盘）。HK/US/CN/JP 支持股票和指数，默认 `assetType=stock`；GLOBAL 仅支持债券，默认 `assetType=bond`。CN 日 K 默认 `adjust=forward`，其余默认 `none`；显式指定优先。日期、市场与资产组合、根数在请求执行前校验。

**使用示例**

> "帮我看 AAPL 最近 60 根日 K 线，前复权"

**get_jp_kline 参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `market` | string enum | 否 | 仅支持 `JP`（日股），默认 JP。 |
| `date` | string | 否 | 查询日期/时间。K线类型为日周月季年时，时间必须为格式为"yyyy-MM-dd"这种时间格式。K线类型为分K级别时，时间必须为格式为"yyyy-MM-dd HH:mm:ss"这种时间格式 |
| `limit` | integer | 否 | 查询条数，默认 **20**，范围 1～500 |
| `symbol` | string | 是 | 单只日股证券代码，例如 `6758.jp`。 |
| `symbols` | string[] | 否 | 非空批量代码列表，例如 `["6758.jp","7203.jp"]`；同时填写 symbol 时，symbol 须包含在列表中。 |
| `type` | integer enum | 否 | K线类型：0（日）、1（周）、2（月）、3（季）、4（年）、5（1分）、6（5分）、7（15分）、8（30分）、9（60分）、10（120分）、11（3分）、12（240分）。 |
| `timeMode` | integer enum | 否 | 0（实时）、1（延时），默认 0。 |

```json
{"endpoint":"get_jp_kline","params":{"symbol":"6758.jp","symbols":["6758.jp","7203.jp"],"type":11,"limit":20,"timeMode":0}}
```

type 默认 0（日 K）。省略 date 时查询最新 K 线。返回顶层 `meta/format/columns/columnNames/rows`，数据固定为以下 13 列，顺序与表格一致。缺失值保留 `null`，数值及字符串精度保持原值，其余数据字段不返回。单只证券的 meta 包含 symbol、market、period、count；批量按 meta.symbols 顺序拼接记录，meta.rowCounts 对应每只证券的记录数（空结果为 0），meta.count 为总根数。

| 返回字段 | 中文含义 |
| --- | --- |
| `amount` | 成交额 |
| `amountLast` | 总成交额 |
| `change` | 涨跌额 |
| `changeRate` | 涨跌幅 |
| `close` | 收盘价 |
| `date` | 日期 |
| `high` | 最高价 |
| `low` | 最低价 |
| `open` | 开盘价 |
| `preClose` | 昨收价 |
| `turnoverRate` | 换手率 |
| `volume` | 成交量 |
| `volumeLast` | 总成交量 |

---

### 5. quote_derivatives_hk — 港股衍生品

窝轮（认购/认沽证）和牛熊证（CBBC）的发行商目录、产品列表、基本资料、历史交易数据、排名统计以及扩展报价。专注港股结构化衍生品市场。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                |
| ------------ | ------ | ---- | ------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_hk_warrant_catalog` / `get_hk_warrant_trading_data` / `get_quote_extend`                                 |
| `params`   | object | 是   | 包含`warrantType`（issuer/list/list_en/profile）、`warrantTradeType`（history/rank/statistics）、`symbols` 等 |

**使用示例**

> "帮我找腾讯相关的所有窝轮和牛熊证" / "港股窝轮成交排名前十有哪些"

---

### 6. quote_us_options — 美股期权链

美股 OPRA 期权链数据：到期日列表、期权链、快照、希腊字母（Greeks）、看涨/看跌成交量统计、期权概况、实时报价、K 线和排名。覆盖美股全市场期权合约。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_us_option_chain` / `get_us_option_overview` / `get_us_option_quote` / `get_us_option_rankings`                         |
| `params`   | object | 是   | 包含`optionType`（expiration/chain/symbols/snapshot/greeks/callput_volume）、`rankType`（list/statistics/top10）、`symbol` 等 |

**使用示例**

> "查看 AAPL 的期权链，有哪些到期日可选" / "AAPL 近月看涨期权成交最活跃的是哪个"

---

### 7. market_overview — 市场概览

查询港股、美股、A股、日股的实时涨跌家数及涨跌幅分布。

**输入参数**

| 参数         | 类型        | 必填 | 说明                      |
| ------------ | ----------- | ---- | ------------------------- |
| `endpoint` | string      | 是   | `get_market_statistics` |
| `market`   | string enum | 是   | HK / US / CN / JP。       |

返回顶层 `columns/columnNames/rows`，每行包含 `market`（统计范围代码）、`marketName`（市场中文说明），各列按相同位置对应。港股展示 ALL=全部市场、MAIN=主板、GEM=创业板；美股展示 ALL=全部市场、Q=Nasdaq全球精选市场、G=Nasdaq全球市场、S=Nasdaq资本市场、N=NYSE纽约交易所、A=NYSE MKT（AMEX）、P=NYSE Arca、Z=BATS交易所、V=Investor's Exchange，LLC（投资者交易所）；A股与日股展示 ALL=全部市场。全部市场和分板块不能重复相加。

| 返回字段              | 含义（x 为涨跌幅）           |
| --------------------- | ---------------------------- |
| `time`              | 统计更新时间，保留原始时间值 |
| `fall4`             | 下跌四档家数，x≤-7%         |
| `fall3`             | 下跌三档家数，-7%<x<-5%      |
| `fall2`             | 下跌二档家数，-5%≤x<-3%     |
| `fall1`             | 下跌一档家数，-3%≤x<0%      |
| `fall`              | 下跌家数，x<0%               |
| `flat`              | 平盘家数，x=0%               |
| `rise`              | 上涨家数，x>0%               |
| `rise1`             | 上涨一档家数，0%<x≤3%       |
| `rise2`             | 上涨二档家数，3%<x≤5%       |
| `rise3`             | 上涨三档家数，5%<x<7%        |
| `rise4`             | 上涨四档家数，x≥7%          |
| `limitDown/limitUp` | A股可用的跌停/涨停家数       |

各范围保留自己的更新时间；缺失值保留 null，空数据不补零。任一范围查询失败时返回错误。

**使用示例**

> "今天港股市场整体表现怎么样？涨跌家数如何？"

---

### 8. market_ranking — 多维度排名

覆盖港股、美股、A股、日股排行。只调用 MCP 工具 `market_ranking`，顶层必填参数为 `endpoint:string enum` 和 `params:object`；市场由 endpoint 决定，rankType 和其他业务字段全部放入 params，无需 market。四个市场名称是 endpoint，不是独立 MCP 工具。

| endpoint           | params.rankType                                  |
| ------------------ | ------------------------------------------------ |
| `get_hk_ranking` | stock / industry / ipo / broker / market_premium |
| `get_us_ranking` | stock / industry / ipo / etf                     |
| `get_cn_ranking` | stock / industry / ipo                           |
| `get_jp_ranking` | stock / hot_stock / industry                     |

排序字段、资产类型、默认值与分页能力按 rankType 校验。`describe_tool` 查询工具集返回四市场目录；查询市场 endpoint 时返回完整字段字典 parameters、类型差异 variants 和全部 oneOf 分支，按 rankType 选择对应约束。例如查询说明：`{"toolNames":["get_hk_ranking"],"detail":"params"}`；调用 `market_ranking`：`{"endpoint":"get_hk_ranking","params":{"rankType":"stock","marketBoard":"MAIN","pageSize":10}}`。

返回统一为顶层 `columns/columnNames/rows` 紧凑表，保留接口提供的 `total`，不返回 `semanticTool/data` 包装或导航分页字段。完整参数、市场枚举、兼容规则和差异说明见 [市场排行调用契约](market-ranking-migration.md)。以下参数表仅说明原 `market_ranking.get_rankings` 入口，不用于新市场工具。

**输入参数**

| 参数            | 类型         | 必填 | 说明                                                                                         |
| --------------- | ------------ | ---- | -------------------------------------------------------------------------------------------- |
| `endpoint`    | string       | 是   | `get_rankings`                                                                             |
| `market`      | string enum  | 是   | HK / US / CN / JP。                                                                          |
| `rankType`    | string enum  | 是   | stock / industry / ipo / broker / market_premium / etf / hot_stock；具体市场组合见参数说明。 |
| `marketBoard` | string       | 否   | 市场板块代码。                                                                               |
| `assetType`   | string enum  | 否   | stock / etf / warrant / bond / trust / adr / common，默认 stock。                            |
| `stockKind`   | string       | 否   | 美股股票集合。                                                                               |
| `conceptFlag` | string enum  | 否   | Y=概念、N=行业，默认 N。                                                                     |
| `symbol`      | string       | 否   | 经纪商等排行使用的证券代码。                                                                 |
| `date`        | string       | 否   | 查询日期，YYYY-MM-DD。                                                                       |
| `price`       | number       | 否   | 指定价格。                                                                                   |
| `types`       | integer[]    | 否   | 美股 ETF 排行周期列表，默认 [0]。                                                            |
| `state`       | string       | 否   | 日股交易状态。                                                                               |
| `sessionId`   | integer enum | 否   | -1=盘前、1=盘中、-2=盘后，默认 1。                                                           |
| `sortField`   | string enum  | 否   | `changeRate`=涨跌幅、`amount`=成交额、`volume`=成交量，默认 `changeRate`。           |
| `sortType`    | integer enum | 否   | 0=升序、1=降序，默认 1。                                                                     |
| `timeMode`    | integer enum | 否   | 0=实时、1=延时，默认 0。                                                                     |
| `pageNum`     | integer      | 否   | 页码，从 1 开始，默认 1。                                                                    |
| `pageSize`    | integer      | 否   | 每页数量，默认 20，最大 200。                                                                |

**使用示例**

> "今天港股涨幅前十的股票有哪些？" / "A 股哪些行业板块涨得最好"

---

### 9. market_flow — 资金流向

单只股票的当日资金流向、近60日资金流向和资金分布。支持港股、美股、A股、日股。

资金流返回采用紧凑表结构：`columns` 为英文字段名，`columnNames` 为对应中文含义，`rows` 按列位置返回数据。常见字段包括：`capitalBigFunds`=大单资金流向、`capitalLargeFunds`=特大单资金流向、`capitalMidFunds`=中单资金流向、`capitalSmallFunds`=小单资金流向、`totalFunds`=整体资金流向、`changeRate`=涨跌幅、`close`=收盘价、`date`/`time`=时间；`capitalInTotal`=主动买入总额、`capitalInLarge`=主动买入超大单、`capitalInBig`=主动买入大单、`capitalInMid`=主动买入中单、`capitalInSmall`=主动买入小单；`capitalOutTotal`=主动卖出总额、`capitalOutLarge`=主动卖出超大单、`capitalOutBig`=主动卖出大单、`capitalOutMid`=主动卖出中单、`capitalOutSmall`=主动卖出小单。

**输入参数**

| 参数         | 类型        | 必填 | 说明                                                                |
| ------------ | ----------- | ---- | ------------------------------------------------------------------- |
| `endpoint` | string      | 是   | `get_capital_flow`                                                |
| `market`   | string enum | 是   | HK / US / CN / JP。                                                 |
| `symbol`   | string      | 是   | 证券、指数或板块代码。                                              |
| `flowType` | string enum | 是   | current=当日资金流向、daily=近60日资金流向、distribution=资金分布。 |

**使用示例**

> "00700.hk 最近资金是流入还是流出？主力资金动向如何？"

---

### 10. market_structure — 市场结构

指数成分股及映射关系、行业分类及行业成分股、市场微观结构（买卖价差、AH 溢价、双重柜台、券商列表）。支持港股、美股、A股（中华通）、日股。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                                                                             |
| ------------ | ------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_index_data` / `get_industry_data` / `get_market_microstructure`                                                                                                                                       |
| `params`   | object | 是   | 包含`market`、`indexType`（list/quote/constituent/mapping/capital_distribution）、`industryType`（list/rank/constituent/belong_quote）、`dataType`（spread/market_premium/double_counter/broker_list）等 |

**使用示例**

> "恒生指数成分股有哪些？" / "贵州茅台属于哪个行业板块？"

---

### 11. market_position_cost — 持仓成本

筹码分布区间和筹码集中度分析，帮助判断支撑位、压力位和主力持仓成本。支持港股和美股市场。

**输入参数**

| 参数         | 类型        | 必填     | 说明                                                |
| ------------ | ----------- | -------- | --------------------------------------------------- |
| `endpoint` | string      | 是       | `get_position_cost`                               |
| `market`   | string enum | 是       | HK / US。                                           |
| `symbol`   | string      | 是       | 证券代码。                                          |
| `costType` | string enum | 是       | range=指定价格获利比例、distribution=筹码移动分布。 |
| `date`     | string      | 否       | 查询日期，YYYY-MM-DD；默认今天。                    |
| `price`    | number      | 条件必填 | 指定价格。                                          |
| `high`     | number      | 条件必填 | 最高价。                                            |
| `low`      | number      | 条件必填 | 最低价。                                            |

**使用示例**

> "帮我看看 00700.hk 的筹码分布，当前持仓成本集中在什么区间？"

---

### 12. f10_profile — 公司概况

公司简介、管理层信息、扩展资料（并行数据、扩展全貌）和统一行业归属。覆盖港股、美股、A股（中华通），按市场自动汇总可用的公司资料，并清理空值和重复字段。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                 |
| ------------ | ------ | ---- | ------------------------------------------------------------------------------------ |
| `endpoint` | string | 是   | `get_company_profile` / `get_company_management` / `get_company_extra_profile` |
| `params`   | object | 是   | 包含`market`、`symbol`                                                           |

**使用示例**

> "腾讯控股的公司简介和管理层有哪些人？" / "帮我查一下苹果公司的基本信息"

---

### 13. f10_financials — 财务报表

利润表（income）、资产负债表（balance）、现金流量表（cash）三大报表，以及 ROE、毛利率、净利率、资产负债率等关键财务比率指标。支持港股、美股、A股（中华通）。

`get_financial_statement` 和 `get_financial_indicator` 与行情域使用相同的顶层紧凑表契约，不再包含 `semanticTool/data` 包装：`columns` 是英文字段名，`columnNames` 是逐列对应的中文名，`rows[*][i]` 对应 `columns[i]`。中文名优先采用清洗后的对应数据接口定义。完整财务表按元数据、资产、负债、权益、收入、成本费用、利润、经营/投资/融资现金流、现金汇总、每股指标、财务比率、调整项和其他字段排列，基础值与对应 `YoY` 字段相邻。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                        |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_financial_statement` / `get_financial_indicator`                                                                                                   |
| `params`   | object | 是   | 包含`market`、`symbol`、`statementType`（income/balance/cash，默认 income）、`reportType`（HK: F/I/P/Q1-Q4；US: FY/I1/I2/Q1-Q4；CN: 1/6/9/12/99）等 |

三市场均支持通过 `reportType` 筛选报告期。返回行保留 `coverMonths`：`3` 表示单季，`6` 表示前二季度/上半年累计，`9` 表示前三季度累计，`12` 表示前四季度/年报累计；美股第三季度数据按 `coverMonths` 区分第三季度单季和前三季度累计，并统一返回公开报告期 `Q3`。存在明确口径时同时返回 `periodScope`（`quarter`/`cumulative`）和 `periodDescription`。

**使用示例**

> "贵州茅台最新一期利润表" / "腾讯近三年的 ROE 和毛利率变化趋势"

---

### 14. f10_business_governance — 业务与治理

主营业务收入分部分析、分红记录、拆股/合股历史、股东大会、持股变动、股份回购、股本结构等公司行为数据。覆盖港股、美股、A股（中华通）。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                  |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_business_segment` / `get_company_action`                                                                                                     |
| `params`   | object | 是   | 包含`market`、`symbol`、`actionType`（dividends/splits/meeting/hold_change/repurchase/share_structure）等 |

**使用示例**

> "腾讯的业务收入主要来自哪些板块？" / "苹果近三年的分红记录"

---

### 15. shareholding_structure — 股权结构

主要股东、当前股东、股东详情、前十大股东，以及持股变动记录。覆盖港股、美股、A股（中华通），帮助了解公司股权集中度与大股东增减持动向。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                         |
| ------------ | ------ | ---- | ---------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_shareholders` / `get_shareholding_change`                           |
| `params`   | object | 是   | 包含`market`、`symbol`、`holdingType`（major/current/detail/topten）等 |

**使用示例**

> "腾讯的前十大股东是谁？" / "最近有没有大股东减持 00700.hk？"

---

### 16. shareholding_institution — 美股机构持仓

机构持股明细和机构持股统计。覆盖美股市场，展示机构投资者的持仓数量、比例、变动趋势，是跟踪美股机构动向的核心工具。

**输入参数**

| 参数            | 类型        | 必填 | 说明                                                                         |
| --------------- | ----------- | ---- | ---------------------------------------------------------------------------- |
| `endpoint`    | string      | 是   | `get_institution_holding`                                                  |
| `market`      | string enum | 是   | 市场代码，目前只支持 US（美股）。                                            |
| `holdingType` | string enum | 是   | detail=机构持股明细、statistics=机构持股统计。                               |
| `symbol`      | string      | 是   | 证券代码，需带`.US` 或 `.us` 后缀，例如 AAPL.US。                        |
| `symbols`     | string[]    | 否   | 批量证券代码列表，需带`.US` 或 `.us` 后缀，例如 ["BABA.US", "AAPL.us"]。 |

**返回字段**

`holdingType=detail`：`symbol` 证券代码、`holderName` 股东名称、`holdingNumber` 持股数、`holdingRatio` 持股比例、`changeNumber` 变动股数、`changeRatio` 变动比例、`reportDate` 发布日期。

`holdingType=statistics`：`symbol` 证券代码、`total` 机构总数、`totalChange` 机构总数较上期变动、`holdingNumber` 持股数、`holdingNumberChange` 持股数较上期变动、`holdingRatio` 持股比例、`holdingRatioChange` 持股比例较上期变动环比、`reportDate` 报告日期、`neworgnum` 新进机构数、`addedorgnum` 增持机构数、`reduceorgnum` 减持机构数、`price` 股价。

**使用示例**

> "有哪些机构持有 AAPL？最近机构是在加仓还是减仓？"

---

### 17. shareholding_fund_broker — 券商/沽空

券商持仓比例与排名、沽空（卖空）数据。覆盖港股和美股。基金持仓、基金成分、净值和业绩统一使用 `fund_etf`。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                         |
| ------------ | ------ | ---- | ---------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_broker_holding` / `get_short_sell`                                  |
| `params`   | object | 是   | 包含`holdingType`（ratio/detail/statistics/rank/f10_ratio）、`symbol` 等 |

**使用示例**

> "00700.hk 的沽空比例是多少？" / "哪些券商席位持有腾讯？"

---

### 18. fund_etf — 基金与 ETF

全球基金搜索、基本资料、经理、分红、费率、净值、业绩、风险、完整持仓、资产/行业/国家配置、基准、销售市场、比较、排行、筛选与国家代码解析。基金按 `fund_id` 或 `fund_class_id` 查询，不使用交易市场字段；只有名称或 Ticker 时先搜索，已有稳定 ID 时直接调用目标 endpoint。

**分层描述**

`describe_tool` 可查询 `fund_etf` 工具集或单个 endpoint 的说明。已知 endpoint 时直接查询其完整参数，并根据 mode、operation 或 kind 的有效组合填写业务请求。无需每次重复读取工具集说明；已知参数可直接调用。

```json
{"toolNames":["fund_etf"],"detail":"summary"}
```

```json
{"toolNames":["get_fund_nav"],"detail":"params"}
```

基金 ID、业务分页和日期规则以单 endpoint 的参数说明为准。

**紧凑返回**

`get_fund_nav(operation=history)`、`get_fund_holdings(operation=history)`、`rank_funds`、`screen_funds` 返回顶层 `format/columns/columnNames/rows`，不再使用 `semanticTool/data` 包装。`columns[i]`、`columnNames[i]`、`rows[*][i]` 严格按位置对应。

- 保留实际返回的 `meta`（基金和份额标识、数据日期、估算标记、警告等）。
- 保留 `page`、`page_size`、`has_more`、`next_page`，接口提供 `total` 时也保留；不自动翻页。
- 记录中的份额类别、币种、日期以及原始数值均保留，不跨份额、币种或日期汇总，不换算收益率、权重或币种；缺失值不填零。
- 空列表保留表结构、元数据及分页。未知字段保留，并显式标注缺少中文名。
- 最新净值、当前/前十大持仓及其余 endpoint 保持原有返回格式。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `endpoint` | string | 是   | `search_funds` / `get_fund_profile` / `get_fund_managers` / `get_fund_distributions` / `get_fund_terms` / `get_fund_nav` / `get_fund_performance` / `compare_funds` / `get_fund_risk` / `rank_funds` / `screen_funds` / `get_fund_holdings` / `get_fund_exposure` / `get_fund_benchmark` / `get_fund_sales_markets` / `get_country_code` |
| `params`   | object | 是   | 基金引用使用`fund_id` 或 `fund_class_id`；分页使用 `page`（从 0 开始）和 `page_size`（最大 200）；日期使用 `start_date` / `end_date`                                                                                                                                                                                                                         |

**使用示例**

> "搜索代码为 DRAM 的基金，并查询它的完整持仓" / "比较这几只基金的资料和近一年表现"

---

### 19. stock_connect — 沪深港通

北向/南向资金额度使用、净成交额、累计净流入、持股比例、成交排名、持股变动率排名、资金流向分布。覆盖港股通和陆股通双向数据。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                                                                                                            |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_stock_connect_data` / `get_hk_stock_connect_data` / `get_cn_stock_connect_data`                                                                                                                                                      |
| `params`   | object | 是   | 包含`connectType`（minute_flow/balance/cumulative_net_turnover_in/cumulative_net_flow/net_turnover/rank_change_rate/rank_net_turnover_in/rank_shareholdings/rank_traded/shareholding_ratio/turnover_flow 等）、`marketBoard`（ALL/SH/SZ）等 |

**使用示例**

> "今天北向资金是流入还是流出？" / "沪股通持仓比例最高的 A 股有哪些？"

---

### 20. ipo — IPO 新股

港股和美股 IPO 日历、新股列表（招股中/待上市/已上市）、发行详情、公司资料、承销商/保荐人、基石投资者、孖展（融资）信息、排名、市场数据、认购工具、IPO 新闻、话题、课程和标签。覆盖 IPO 全流程，共 20 个端点。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_hk_ipo_calendar` / `get_hk_ipo_list` / `get_hk_ipo_detail` / `get_hk_ipo_company_profile` / `get_hk_ipo_underwriter` / `get_hk_ipo_cornerstone_investor` / `get_hk_ipo_margin_info` / `get_hk_ipo_notice` / `get_hk_ipo_rankings` / `get_hk_ipo_market_data` / `get_hk_ipo_subscription_tools` / `get_us_ipo_list` / `get_us_ipo_detail` / `get_us_ipo_underwriter` / `get_us_ipo_market_data` / `get_ipo_news` / `get_ipo_topic` / `get_ipo_course` / `get_ipo_tags` / `search_ipo_content` |
| `params`   | object | 是   | 包含`ipoType`（calendar/make_new/today/to_be_listed/listed/offering/company_info/margin 等）、`symbol`、`ipoMarketType`、`contentType` 等                                                                                                                                                                                                                                                                                                                                                                                         |

**使用示例**

> "本周港股有哪些新股在招股？" / "帮我查一下某 IPO 的基石投资者和孖展情况"

---

### 21. bond_basic — 债券基础

债券搜索、债券概况、快照报价、订单簿。使用 `market=GLOBAL` 进行跨市场债券查询，证券代码可使用 ISIN 编码。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                 |
| ------------ | ------ | ---- | ------------------------------------------------------------------------------------ |
| `endpoint` | string | 是   | `search_bond` / `get_bond_profile` / `get_bond_quote` / `get_bond_orderbook` |
| `params`   | object | 是   | 包含`market`（GLOBAL）、`symbol`（支持 ISIN）、`keyword` 等                    |

**使用示例**

> "帮我搜索某 ISIN 对应的债券基本信息" / "查看这只债券的实时报价"

---

### 22. bond_analytics — 债券分析

债券排名、债券图表（收益率曲线等）、债券收益率、债券交易状态。使用 `market=GLOBAL`，提供债券市场的深度分析功能。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                          |
| ------------ | ------ | ---- | --------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_bond_rankings` / `get_bond_chart` / `get_bond_yield` / `get_bond_trading_status` |
| `params`   | object | 是   | 包含`market`（GLOBAL）、`symbol`、`chartType` 等                                        |

**使用示例**

> "查看这只债券的收益率曲线" / "当前债券市场收益率排名"

---

### 23. fiu_news — 金融资讯

最新新闻、关键词搜索、语义搜索、个股相关新闻、新闻详情、关联新闻、新闻统计、新闻摘要。覆盖港股、美股、A股（中华通）、日股，支持标题/摘要/关键词搜索及语义级别的智能匹配，共 8 个端点。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                   |
| ------------ | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `endpoint` | string | 是   | `news_latest` / `news_search` / `news_semantic_search` / `news_by_symbol` / `news_get` / `news_related` / `news_count` / `news_digest` |
| `params`   | object | 是   | 包含`market`（HK/US/CN/JP/GLOBAL）、`query`（搜索关键词）、`symbol`、`id`、`limit`（默认 10，最大 50）、`hours`（默认 24，最大 168）等     |

**使用示例**

> "最近 24 小时关于腾讯的新闻有哪些？" / "搜索港股市场关于 AI 的最新新闻"

---

### 24. financial_calendar — 财经日历

查询全球财经日历，支持按标题关键词、日期范围、国家/地区、市场、事件类型和重要等级筛选，并可按事件 ID 查询详情。覆盖经济数据发布、重要事件、权息和休市安排。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                                                                                                                         |
| ------------ | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `endpoint` | string | 是   | `search_financial_calendar` / `get_financial_event_detail`                                                                                                                                                                                               |
| `params`   | object | 是   | 搜索时`date`（开始日期，YYYY-MM-DD）和 `keyword`（标题关键词）必填；可选 `endDate`、`direction`（-1=向未来，1=向历史）、`limit`、`countryTypes`、`eventTypes`、`markets`、`importanceLevels`。查询详情时传 `id`（搜索结果中的事件 ID）。 |

**返回说明**

搜索返回按日期组织的财经事件及事件 ID；详情接口返回单个事件的完整字段。未传 `endDate` 时使用 `direction` 和 `limit` 控制滚动日期窗口。

**使用示例**

> "查询未来一周美国的重要经济数据" / "查看财经日历事件 ID 12345 的详情"

---

### 25. macro_economics — 宏观经济

查询精选宏观经济指标的最新数据，例如货币供应量、利率、通胀、就业、GDP、贸易和 PMI 等。

**输入参数**

| 参数         | 类型         | 必填 | 说明                                                                                                                                                                  |
| ------------ | ------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string       | 是   | `get_macro_overview`                                                                                                                                                |
| `titleId`  | integer enum | 是   | 宏观指标标题 ID：10=央行资产负债表、20=M2 同比、30=LPR、40=PPI、50=城镇调查失业率、60=固定资产投资、70=社会消费品零售、80=GDP、90=贸易余额、100=CPI、110=制造业 PMI。 |

**返回说明**

返回指定 `titleId` 指标的最新数据，内容包含指标名称、发布时间、数值及同比/环比等可用字段。

**使用示例**

> "查询中国 CPI 最新数据" / "获取当前精选宏观经济指标"

---

### company_announcements — 上市公司公告

查询港股、美股和 A 股上市公司公告。公告记录包含附件地址或正文；附件获取失败时保留该条公告并标记附件状态。

**输入参数**

| 参数          | 类型        | 必填 | 说明                                  |
| ------------- | ----------- | ---- | ------------------------------------- |
| `endpoint`  | string enum | 是   | get_company_announcements。           |
| `market`    | string enum | 是   | HK / US / CN。                        |
| `symbols`   | string[]    | 是   | 至少一个证券代码，例如 ["00700.hk"]。 |
| `startDate` | string      | 否   | 公告开始日期，YYYY-MM-DD。            |
| `endDate`   | string      | 否   | 公告结束日期，YYYY-MM-DD。            |

**调用示例**

```json
{"endpoint":"get_company_announcements","market":"HK","symbols":["00700.hk"]}
```

---

### 26. reference — 参考数据

ISIN/SEDOL/CIK 代码查询、货币代码、交易时段、除权日、退市记录、证券代码映射（股票/指数）、市场交易日历。覆盖港股、美股、A股（中华通）、日股，债券参考数据使用 `market=GLOBAL`，共 4 个端点。

**输入参数**

| 参数         | 类型   | 必填 | 说明                                                                                                                                                                                                                                                  |
| ------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint` | string | 是   | `get_reference_data` / `get_symbol_mapping` / `get_trading_status` / `get_market_hours`                                                                                                                                                       |
| `params`   | object | 是   | 包含`referenceType`（isin/sedol/trade_symbol/warrant_related/currency/basic_symbol/cik/adr/bond_codes/yield_codes / stock/index）、`statusType`（trade_date/session/exright/security/delisted/current/bond_session/yield_session）、`symbol` 等 |

**使用示例**

> "帮我查 00700.hk 的 ISIN 代码" / "今天港股是否交易日？交易时段是什么？"

---

## 接入配置

### 前置条件

1. 访问 [ai.szfiu.com](http://ai.szfiu.com) 申请 API Key
2. 支持 Streamable HTTP 协议的 MCP 客户端

### 配置示例

在 MCP 客户端配置文件中添加：

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

**Claude Code 一行命令接入：**

```bash
claude mcp add --transport http fiu-finance http://ai.szfiu.com/api/mcp/v2 \
  --header "Authorization: Bearer YOUR_API_KEY"
```

配置完成后重启 MCP 客户端即可使用。

### 认证方式

API Key 认证：在 HTTP Header 中传入 `Authorization: Bearer YOUR_API_KEY`，每个请求均需携带。

---

## 服务端说明

本项目不涉及服务端源码交付或客户侧部署。服务端由深圳市融聚汇信息科技有限公司统一维护和运营。客户通过 API Key 接入后即可使用全部功能。

---

## 兼容平台

Claude Code、Claude Desktop、Cherry Studio、Cursor、ChatWise 及任何支持 Streamable HTTP 协议的 MCP 客户端。

---

## 版本信息

v2.0.0

---

## 相关资源

- [GitHub Issues](https://github.com/szfiu-ai/mcp-server/issues)

---

## 服务开通

访问 [http://ai.szfiu.com](http://ai.szfiu.com) 查看定价方案并申请 API Key。

---

## 通信协议

MCP Streamable HTTP 协议

---

## 开源协议

MIT
