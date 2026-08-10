# Changelog

All notable changes to the FIU Finance MCP Server are documented here.

## [2.0.0]

The MCP surface is consolidated into a single endpoint.

### Added

- Single Streamable HTTP endpoint `http://ai.szfiu.com/api/mcp/v2` replacing the per-market server URLs.
- `describe_tool` — returns parameters, enums, market coverage and capability boundaries at three levels of detail (`summary` / `params` / `full`).
- 23 business toolsets covering 86 endpoints, invoked as `{ endpoint, params }`.
- Japan (`JP`) and global fixed-income (`GLOBAL`) market coverage.
- New domains: US options (`quote_us_options`), ETF and fund data (`fund_etf`), IPO (`ipo`, 20 endpoints), bonds (`bond_basic`, `bond_analytics`), news (`fiu_news`), reference data (`reference`).
- Gateway-side validation of required fields, enums and market applicability, with actionable error messages instead of empty result sets.

### Changed

- Tool naming moved from raw downstream operations to capability-oriented toolsets.
- `reportType` filtering on financial statements is now documented per market: HK uses letters (`I`, `F`, `P`, `Q1`, `Q3`, `Q4`, `Q5`), A-share(Zhcall) uses integers (`1`, `6`, `9`, `12`, `99`).

## [1.0.2]

- Domain migrated from `mcp.szfiu.com` to `ai.szfiu.com`.

## [1.0.1]

- Endpoint paths moved under `/api/mcp/`.

## [1.0.0]

- Initial release with per-market MCP servers for A-share(Zhcall), Hong Kong and US.
