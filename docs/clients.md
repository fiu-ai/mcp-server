# Client Setup

Connection details, identical for every client:

| | |
| --- | --- |
| URL | `http://ai.szfiu.com/api/mcp/v2` |
| Transport | Streamable HTTP |
| Header | `Authorization: Bearer YOUR_API_KEY` |

Get an API key at http://ai.szfiu.com.

---

## Claude Code

```bash
claude mcp add --transport http fiu-finance http://ai.szfiu.com/api/mcp/v2 \
  --header "Authorization: Bearer YOUR_API_KEY"
```

Verify:

```bash
claude mcp list
```

## Claude Desktop

Edit `claude_desktop_config.json`:

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

Restart the app after saving.

## Cursor

Edit `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (per project):

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

**Import JSON** — Settings → MCP Servers → Import from JSON:

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

**Manual** — Settings → MCP Servers → Add Server:

| Field | Value |
| --- | --- |
| Name | FIU Finance |
| Type | Streamable HTTP |
| URL | `http://ai.szfiu.com/api/mcp/v2` |
| Headers | `Authorization=Bearer YOUR_API_KEY` |

## ChatWise / other MCP clients

Any client that supports Streamable HTTP with custom headers works. Point it at the URL above and add the `Authorization` header.

---

## Verify the connection

Once connected, the client should list **24 tools**: `describe_tool` plus 23 business toolsets.

Ask the model:

```text
List the FIU Finance tools you can see.
```

Or call `describe_tool` directly:

```json
{ "toolNames": ["quote_spot"], "detail": "summary" }
```

---

## Command line

Useful for scripting or verifying a key without a client. Note that Streamable HTTP requires an `initialize` handshake before `tools/call`, so a bare `curl` is only enough to check reachability and auth:

```bash
curl -sS -X POST http://ai.szfiu.com/api/mcp/v2 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'
```

| Response | Meaning |
| --- | --- |
| `event: message` with `serverInfo` | Connected |
| `401 {"error":"缺少认证头"}` | No `Authorization` header |
| `401 {"error":"无效的令牌"}` | Key rejected |

For full request/response cycles from the shell, use the helper scripts shipped with the [FIU Finance skill](https://github.com/fiu-ai/openclaw-skills).

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| No FIU tools in the session | Client not connected | Recheck the URL and restart the client |
| `401 缺少认证头` | Header missing | Add `Authorization: Bearer YOUR_API_KEY` |
| `401 无效的令牌` | Key wrong or expired | Reissue the key at http://ai.szfiu.com |
| `INVALID_ARGUMENT` / `INVALID_SEMANTIC_INPUT` | Missing or wrong-valued parameter | Read `details.issues`; call `describe_tool` with `detail: "params"` |
| `INVALID_DOWNSTREAM_ARGS` | Endpoint discriminator missing (`ipoType`, `connectType`, `dataType`, …) | Call `describe_tool` for that endpoint and supply the required field |
| Empty result set | Market or period not covered for that symbol | Check the toolset's market coverage in [toolsets.md](toolsets.md) |
| `DOWNSTREAM_NETWORK_ERROR` | Upstream data service unreachable | Report the `requestId` from the error payload |
