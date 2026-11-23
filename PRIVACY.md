# FIU MCP Privacy Policy / FIU MCP 隐私政策

Effective date / 生效日期：2026-11-23

[中文](#中文) | [English](#english)

## 中文

### 1. 适用范围与运营者

本政策说明深圳市融聚汇信息科技有限公司（以下简称“FIU”或“我们”）在提供 FIU MCP 金融数据服务及处理相关支持请求时如何处理信息。服务网站为 <https://ai.szfiu.com>，公开 MCP 接入地址为 <https://ai.szfiu.com/api/mcp/v2>。

本政策同时说明本仓库本地客户端适配器的数据传递方式。您使用的 AI 助手、MCP 客户端、代码托管平台及其他第三方服务有各自的隐私政策；本政策不替代其政策，也不决定其数据留存或模型训练行为。

### 2. 我们处理的信息

- **账号与认证信息**：为开通、认证和管理服务而提供的账号标识、联系方式、API Key 等认证信息，以及服务权限、套餐和用量信息。
- **查询与返回数据**：您或您授权的客户端提交的工具名称、完整查询参数和服务返回结果。参数可能包括证券代码、市场、日期、筛选条件和搜索关键词。**FIU 的调用日志可能保存完整 MCP 查询参数和返回结果**，请勿在查询参数中加入与金融数据查询无关的个人信息或秘密。
- **运行与用量记录**：请求及调用标识、调用时间、所用工具或端点、响应状态、错误信息、耗时，以及用于配额、计费和运行维护的调用记录。
- **支持沟通信息**：您主动发送给我们的联系信息、问题描述及相关排障材料。请勿通过邮件或公开 Issue 发送密码、API Key 或其他认证秘密。

FIU MCP 提供金融信息查询，不通过这些工具执行证券交易、转账或资金划转。服务不要求您在金融查询参数中提供银行卡密码、券商交易密码或身份证件号码。

### 3. 处理目的与依据

我们将信息用于认证与权限管理、完成您请求的金融数据查询、返回结果、管理套餐及配额、核算服务用量、排查故障、维护安全、防止滥用、响应支持请求，以及履行适用法律规定的义务。

我们根据适用法律要求，以提供您请求的服务、履行与您的合同、履行法定义务或在需要时取得您的同意等适用依据处理个人信息。需要单独告知或取得同意的处理，以完成该等要求为前提。

**FIU 不将 MCP 查询参数、返回结果及相关调用日志用于训练 AI 模型。** 这一承诺针对 FIU 的处理行为；第三方 AI 助手或客户端对其接收数据的处理，请查看其政策和账号设置。

### 4. 信息接收方与第三方服务

为完成查询，相关请求参数需要在 FIU 的服务组件和提供该项金融数据的数据服务方之间传递，查询结果会返回给您选用的客户端。提供托管、网络、存储等服务的服务商，也可能在履行其服务所需的范围内处理相关信息。

您决定使用哪个客户端接入 FIU，并应了解该客户端如何处理 API Key、查询及返回结果。您也可以选择停止使用该客户端或移除其 FIU 连接配置。

我们仅在上述服务目的所需范围、您的有效授权范围或适用法律要求的情况下向其他接收方提供相关个人信息。涉及依法需要另行告知或取得同意的提供行为，我们将按要求处理。

### 5. 存储地点与保留期限

**FIU 的 MCP 调用日志主要存储在中国大陆，通常保留约 3 天。** “约 3 天”是一般日志保留周期，不是每条记录恰好在第 72 小时删除的保证。

该周期针对 MCP 调用日志，不表示账号资料、套餐及计费记录、支持沟通记录或第三方客户端保存的数据也在同一期限内删除。账号、计费及支持记录以维持相关服务、处理请求和满足适用法律义务所必需的期限为限；您可通过下述邮箱查询特定记录的保留情况并提出删除请求。依法必须保留的记录按适用要求处理。

从中国大陆以外访问 FIU，意味着相关请求会传输至 FIU 的服务设施。您选用的客户端及相关服务商可能在其他地区处理数据；如发生适用法律要求履行特定程序的跨境处理，我们将按该等要求办理。

### 6. 本地适配器与信息安全

本仓库的 `fiu-finance-mcp` 适配器将 MCP 请求转发到配置的服务端，默认使用 FIU 的 HTTPS 接入地址。为向代理进程传递认证请求头，适配器会在您设备的临时目录写入包含认证信息的临时文件，并在清理流程中删除；进程异常终止等情况可能导致临时文件残留。第三方代理依赖、客户端的调试日志及本地配置有各自的存储行为。

请妥善保管设备、API Key 和客户端配置，仅向可信客户端提供密钥，并在怀疑泄漏时及时停用或更换。不要将密钥写入聊天内容、公开仓库、Issue 或工具的业务参数。默认服务使用 HTTPS，且访问需要认证；这些措施不能保证任何传输或存储绝对安全。安全问题可通过下述邮箱私下报告。

### 7. 您的选择与权利

您可以停止调用服务、移除客户端配置，并联系我们处理账号注销。根据适用法律，您可以请求访问、更正、删除相关个人信息，或提出撤回同意、限制处理等请求。

请发送邮件至 **<rudy@szfiu.com>**，说明您的账号标识、请求类型和相关情况；不要附上 API Key 或密码。我们可能要求合理的身份核验，并在适用法律规定的范围和期限内处理请求。删除、撤回同意或注销可能影响继续提供服务；依法需要保留的信息不因请求而立即删除。FIU 无法代替第三方客户端删除其独立保存的副本，您需要向该第三方提出相应请求。

### 8. 政策更新与联系

政策更新将在本页面发布，并注明生效日期；依法需要额外通知或取得同意的变更，我们将履行相关要求。

- 运营者：深圳市融聚汇信息科技有限公司
- 服务网站：<https://ai.szfiu.com>
- 隐私、数据权利、账号注销及支持邮箱：<rudy@szfiu.com>
- 服务条款：[TERMS.md](TERMS.md)

## English

### 1. Scope and operator

This policy explains how Shenzhen Rongjuhui Information Technology Co., Ltd. (深圳市融聚汇信息科技有限公司, “FIU,” “we,” or “us”) handles information when providing the FIU MCP financial data service and related support. Our service website is <https://ai.szfiu.com>, and the public MCP endpoint is <https://ai.szfiu.com/api/mcp/v2>.

It also describes data transmission by the local adapter in this repository. AI assistants, MCP clients, code hosting platforms and other third-party services have their own policies. This policy does not replace those policies or control their retention or model-training practices.

### 2. Information we process

- **Account and authentication information:** account identifiers, contact details, API keys and other authentication information supplied to activate, authenticate and manage the service, together with entitlements, plans and usage information.
- **Queries and returned data:** tool names, complete query parameters and service responses submitted or received through you or your authorized client. Parameters may include security identifiers, markets, dates, filters and search terms. **FIU call logs may store complete MCP query parameters and returned results.** Do not include unrelated personal information or secrets in query parameters.
- **Operational and usage records:** request and call identifiers, timestamps, tools or endpoints used, response status, errors, duration, and call records used for quotas, billing and service operation.
- **Support correspondence:** contact information, problem descriptions and troubleshooting materials you provide. Do not send passwords, API keys or other authentication secrets by email or public issue.

FIU MCP retrieves financial information. Its tools do not execute securities trades or move money. Financial query parameters do not require bank passwords, brokerage trading passwords or identity document numbers.

### 3. Purposes and grounds for processing

We use information to authenticate users, manage access, fulfill financial data requests, return results, manage plans and quotas, account for usage, diagnose problems, maintain security, prevent abuse, provide support and meet applicable legal obligations.

Depending on applicable law, processing relies on providing the service you request, performing our contract with you, meeting legal obligations or obtaining consent where required. Processing that requires a separate notice or consent is subject to those requirements.

**FIU does not use MCP query parameters, returned results or related call logs to train AI models.** This commitment concerns FIU's processing. Consult your third-party assistant's or client's policy and settings for its own use of data.

### 4. Recipients and third-party services

To fulfill a query, relevant request parameters pass between FIU service components and the data service providers supplying the requested financial information. Results are returned to your chosen client. Hosting, network, storage and other service providers may also process information as necessary to provide their services.

You choose which client connects to FIU and should review how it handles API keys, queries and results. You can stop using that client or remove its FIU connection configuration.

We provide relevant personal information to other recipients only as necessary for the purposes described above, within your valid authorization, or as required by applicable law. Any disclosure requiring a separate notice or consent is subject to those requirements.

### 5. Storage location and retention

**FIU MCP call logs are stored primarily in mainland China and are normally retained for approximately three days.** This is the general log retention cycle, not a guarantee that every record is deleted at exactly 72 hours.

This period applies to MCP call logs. It does not mean that account details, plan and billing records, support correspondence or copies retained by third-party clients are deleted on the same schedule. Account, billing and support records are retained only for as long as needed to maintain the relevant service, handle requests and meet applicable legal obligations. Contact us to ask about specific records or request deletion. Records that must be retained by law are handled accordingly.

Accessing FIU from outside mainland China transmits requests to FIU's service facilities. Your chosen client and relevant service providers may process data in other locations. Where cross-border processing requires particular procedures under applicable law, we will follow those requirements.

### 6. Local adapter and security

The `fiu-finance-mcp` adapter forwards MCP requests to the configured server, using FIU's HTTPS endpoint by default. To supply authentication headers to its proxy process, it writes a temporary file containing authentication information in your device's temporary directory and removes it during cleanup. Abnormal process termination may leave that file behind. Third-party proxy dependencies, client debug logs and local configurations have their own storage behavior.

Protect your device, API keys and client configuration. Give keys only to trusted clients and disable or replace them if exposure is suspected. Do not put keys in chats, public repositories, issues or business tool parameters. The default service uses HTTPS and requires authentication, but no transmission or storage is guaranteed to be completely secure. Report security concerns privately using the contact below.

### 7. Your choices and rights

You may stop calling the service, remove client configuration and contact us to close your account. Subject to applicable law, you may request access, correction or deletion of personal information, withdraw consent or request restrictions on processing.

Email **<rudy@szfiu.com>** with your account identifier, request type and relevant details. Do not include an API key or password. We may require reasonable identity verification and will handle requests within the scope and deadlines required by applicable law. Deletion, withdrawal of consent or account closure may affect our ability to provide the service; legally required records may not be deleted immediately. FIU cannot delete independently retained copies held by third-party clients; contact those providers separately.

### 8. Updates and contact

Updates will be published on this page with an effective date. We will provide additional notice or obtain consent where applicable law requires it.

- Operator: Shenzhen Rongjuhui Information Technology Co., Ltd. (深圳市融聚汇信息科技有限公司)
- Service website: <https://ai.szfiu.com>
- Privacy, data rights, account closure and support: <rudy@szfiu.com>
- Terms of service: [TERMS.md](TERMS.md)

The Chinese and English sections describe the same policy. Any interpretation remains subject to applicable mandatory law.
