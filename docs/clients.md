# Client Setup

Connection details, identical for every client:

| | |
| --- | --- |
| URL | `https://ai.szfiu.com/api/mcp/v2` |
| Transport | Streamable HTTP |
| Header | `Authorization: Bearer YOUR_API_KEY` |

Get an API key at https://ai.szfiu.com.

---

## Claude Code

```bash
claude mcp add --transport http fiu-finance https://ai.szfiu.com/api/mcp/v2 \
  --header "Authorization: Bearer YOUR_API_KEY"
```

Verify:

```bash
claude mcp list
```

## npm/npx stdio adapter

The published `fiu-finance-mcp` package starts a local stdio adapter and forwards requests to the same remote service. Use Node.js 20.18.1 or newer:

```bash
FIU_API_KEY=YOUR_API_KEY npx -y fiu-finance-mcp
```

For a client configuration:

```json
{
  "mcpServers": {
    "fiu-finance": {
      "command": "npx",
      "args": ["-y", "fiu-finance-mcp"],
      "env": { "FIU_API_KEY": "YOUR_API_KEY" }
    }
  }
}
```

`fiu-finance-mcp --api-key YOUR_API_KEY` overrides `FIU_API_KEY`; `--url` overrides the default HTTPS endpoint. Use this mode for clients that do not support remote Streamable HTTP.

## Claude Desktop

Edit `claude_desktop_config.json`:

- macOS — `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows — `%APPDATA%\Claude\claude_desktop_config.json`

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

Restart the app after saving.

## Cursor

Edit `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (per project):

```json
{
  "mcpServers": {
    "fiu-finance": {
      "url": "https://ai.szfiu.com/api/mcp/v2",
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
      "baseUrl": "https://ai.szfiu.com/api/mcp/v2",
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
| URL | `https://ai.szfiu.com/api/mcp/v2` |
| Headers | `Authorization=Bearer YOUR_API_KEY` |

## ChatWise / other MCP clients

Any client that supports Streamable HTTP with custom headers works. Point it at the URL above and add the `Authorization` header.

---

## Verify the connection

Once connected, the client should list **28 tools**: `describe_tool`, `search` and 26 business toolsets. A deployed server can differ; verify with `tools/list`.

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
curl -sS -X POST https://ai.szfiu.com/api/mcp/v2 \
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
| `401 无效的令牌` | Key wrong or expired | Reissue the key at https://ai.szfiu.com; for stdio also check `FIU_API_KEY` or `--api-key` |
| `INVALID_ARGUMENT` / `INVALID_SEMANTIC_INPUT` | Missing or wrong-valued parameter | Read `details.issues`; call `describe_tool` with `detail: "params"` |
| `INVALID_DOWNSTREAM_ARGS` | Endpoint discriminator missing (`ipoType`, `connectType`, `dataType`, …) | Call `describe_tool` for that endpoint and supply the required field |
| `resultStatus=empty` | Query succeeded but returned no business records | Inspect `emptyReason`; adjust the symbol, filters or date range. This is not a transport failure |
| `DOWNSTREAM_NETWORK_ERROR` | Upstream data service unreachable | Report the `requestId` from the error payload |
