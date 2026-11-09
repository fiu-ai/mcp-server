# FIU Finance MCP for DeepSeek Harness

Connect DeepSeek Harness to FIU Finance MCP for Hong Kong, US, A-share, Japan, IPO and bond data.

Install:

```bash
dsh plugin --profile web add github:fiu-ai/mcp-server#path:plugins/fiu-finance-mcp-dsh
```

Compatible with: dsh 0.1.1-rc.2

## What it provides

This bundle injects DeepSeek Harness's `@deepseek-ai/dsh-mcp-client` and starts the published `fiu-finance-mcp` stdio adapter. The adapter forwards MCP calls to `https://ai.szfiu.com/api/mcp/v2` and exposes the current FIU catalog: 26 business toolsets, 104 endpoints and the `describe_tool` and `search` helper tools.

The resulting tools use names such as `mcp__fiu-finance__quote_spot` and `mcp__fiu-finance__company_announcements`.

## Configuration

Set the API key before starting or restarting DeepSeek Harness:

```bash
# macOS / Linux
export FIU_API_KEY="YOUR_API_KEY"

# Windows PowerShell
$env:FIU_API_KEY = "YOUR_API_KEY"
```

Request a key at [https://ai.szfiu.com](https://ai.szfiu.com). The optional `FIU_MCP_URL` environment variable overrides the default HTTPS endpoint.

The child process receives only the explicitly configured FIU variables. The API key is never stored in this repository or in the patch file.

## Troubleshooting

- If the FIU tools do not appear, confirm `npx --version`, `FIU_API_KEY`, and the active profile.
- Reload the plugin or restart DeepSeek Harness after changing environment variables.
- The bundle uses the published `fiu-finance-mcp@1.0.0`; update `cordis.patch.yml` when a newer adapter release is ready.
- The remote service requires `Authorization: Bearer <API_KEY>` and may return no business rows with a successful `resultStatus=empty` response.

## License

[MIT](LICENSE)
