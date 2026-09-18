# 客户端配置指南

所有客户端通用的连接信息：

| 项目 | 值 |
| --- | --- |
| URL | `http://ai.szfiu.com/api/mcp/v2` |
| 传输协议 | Streamable HTTP |
| 请求头 | `Authorization: Bearer YOUR_API_KEY` |

在 http://ai.szfiu.com 申请 API Key。

---

## Claude Code

```bash
claude mcp add --transport http fiu-finance http://ai.szfiu.com/api/mcp/v2 \
  --header "Authorization: Bearer YOUR_API_KEY"
```

验证是否连接成功：

```bash
claude mcp list
```

## Claude Desktop

编辑 `claude_desktop_config.json`：

- macOS — `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows — `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "fiu-finance": {
      "type": "streamableHttp",
      "url": "http://ai.szfiu.com/api/mcp/v2",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

保存后重启应用。

## Cursor

编辑 `~/.cursor/mcp.json`（全局）或 `.cursor/mcp.json`（项目级）：

```json
{
  "mcpServers": {
    "fiu-finance": {
      "url": "http://ai.szfiu.com/api/mcp/v2",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## Cherry Studio

**导入 JSON** — 设置 → MCP 服务器 → 从 JSON 导入：

```json
{
  "mcpServers": {
    "fiu-finance": {
      "name": "FIU Finance",
      "type": "streamableHttp",
      "isActive": true,
      "baseUrl": "http://ai.szfiu.com/api/mcp/v2",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

**手动添加** — 设置 → MCP 服务器 → 添加服务器：

| 字段 | 值 |
| --- | --- |
| 名称 | FIU Finance |
| 类型 | Streamable HTTP |
| URL | `http://ai.szfiu.com/api/mcp/v2` |
| Headers | `Authorization=Bearer YOUR_API_KEY` |

## ChatWise / 其他 MCP 客户端

任何支持 Streamable HTTP 和自定义请求头的 MCP 客户端均可使用。将 URL 配置为上述地址，并添加 `Authorization` 请求头即可。

---

## 验证连接

连接成功后，客户端应列出 **24 个工具**：`describe_tool` 加上 23 个业务工具集。

向模型提问：

```text
列出你能看到的 FIU Finance 工具。
```

或直接调用 `describe_tool`：

```json
{ "toolNames": ["quote_spot"], "detail": "summary" }
```

---

## 命令行测试

适用于脚本调用或在无客户端环境下验证 API Key。注意 Streamable HTTP 协议需要先进行 `initialize` 握手才能调用 `tools/call`，因此普通的 `curl` 仅能验证连通性和鉴权：

```bash
curl -sS -X POST http://ai.szfiu.com/api/mcp/v2 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'
```

| 响应 | 含义 |
| --- | --- |
| `event: message` 含 `serverInfo` | 连接成功 |
| `401 {"error":"缺少认证头"}` | 未传入 `Authorization` 请求头 |
| `401 {"error":"无效的令牌"}` | API Key 被拒绝 |

如需在命令行中进行完整的请求/响应交互，请使用 [FIU Finance skill](https://github.com/fiu-ai/openclaw-skills) 中提供的辅助脚本。

---

## 常见问题排查

| 现象 | 原因 | 解决方法 |
| --- | --- | --- |
| 会话中看不到 FIU 工具 | 客户端未连接 | 重新检查 URL 并重启客户端 |
| `401 缺少认证头` | 请求头缺失 | 添加 `Authorization: Bearer YOUR_API_KEY` |
| `401 无效的令牌` | API Key 错误或已过期 | 在 http://ai.szfiu.com 重新申请 |
| `INVALID_ARGUMENT` / `INVALID_SEMANTIC_INPUT` | 参数缺失或取值错误 | 查看 `details.issues`；调用 `describe_tool` 并指定 `detail: "params"` |
| `INVALID_DOWNSTREAM_ARGS` | 缺少端点判别字段（`ipoType`、`connectType`、`dataType` 等） | 调用 `describe_tool` 查看该端点所需字段 |
| 返回结果为空 | 该证券不覆盖对应市场或时间段 | 查看 [工具集参考手册](toolsets.md) 中的市场覆盖范围 |
| `DOWNSTREAM_NETWORK_ERROR` | 上游数据服务不可达 | 反馈错误信息中的 `requestId` |