# Changelog

All notable changes to the FIU Finance MCP Server are documented here.

## [Unreleased]

- Synchronized the published documentation with the 2026-10-23 product-manual baseline: 26 business toolsets, 104 endpoints and 28 MCP tools including `describe_tool` and `search`.
- Added documentation for `financial_calendar`, `macro_economics` and `company_announcements`.
- Updated market-specific ranking endpoints, the JP K-line endpoint, the current six-endpoint news surface, HTTPS examples and the npm/npx stdio adapter.

## [2.0.0]

The MCP surface is consolidated into a single endpoint.

### Added

- Single Streamable HTTP endpoint `https://ai.szfiu.com/api/mcp/v2` replacing the per-market server URLs.
- `describe_tool` — returns parameters, enums, market coverage and capability boundaries at two levels of detail (`summary` / `params`).
- 23 business toolsets covering 86 endpoints, invoked as `{ endpoint, params }`.
- Japan (`JP`) and global fixed-income (`GLOBAL`) market coverage.
- New domains: US options (`quote_us_options`), ETF and fund data (`fund_data`), IPO (`ipo`, 20 endpoints), bonds (`bond_basic`, `bond_analytics`), news (`fiu_news`), reference data (`reference`).
- Gateway-side validation of required fields, enums and market applicability, with actionable error messages instead of empty result sets.
- Successful business responses now expose `resultStatus` and `code=0`, distinguishing empty data from parameter errors and downstream failures.

### Changed

- Tool naming moved from raw downstream operations to capability-oriented toolsets.
- `reportType` filtering on financial statements is now documented per market: HK uses letters (`I`, `F`, `P`, `Q1`, `Q3`, `Q4`, `Q5`), A-share uses integers (`1`, `6`, `9`, `12`, `99`).

## [1.0.2]

- Domain migrated from `mcp.szfiu.com` to `ai.szfiu.com`.

## [1.0.1]

- Endpoint paths moved under `/api/mcp/`.

## [1.0.0]

- Initial release with per-market MCP servers for A-share, Hong Kong and US.
