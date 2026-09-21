import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import test from "node:test";

function waitForJsonLine(stream) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timeout = setTimeout(
      () => reject(new Error("Timed out waiting for CLI output")),
      10_000,
    );

    stream.setEncoding("utf8");
    stream.on("data", (chunk) => {
      buffer += chunk;
      const newline = buffer.indexOf("\n");
      if (newline === -1) return;

      clearTimeout(timeout);
      try {
        resolve(JSON.parse(buffer.slice(0, newline)));
      } catch (error) {
        reject(error);
      }
    });
    stream.once("error", reject);
  });
}

test("proxies an MCP initialize request over Streamable HTTP", async (t) => {
  let authorization;
  const server = createServer((request, response) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      if (chunks.length === 0) {
        response.writeHead(404).end();
        return;
      }
      authorization = request.headers.authorization;
      const message = JSON.parse(Buffer.concat(chunks).toString("utf8"));

      if (message.method === "initialize") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            jsonrpc: "2.0",
            id: message.id,
            result: {
              protocolVersion: "2025-06-18",
              capabilities: { tools: {} },
              serverInfo: { name: "fiu-test-server", version: "1.0.0" },
            },
          }),
        );
        return;
      }

      response.writeHead(202).end();
    });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const address = server.address();
  const child = spawn(
    process.execPath,
    [
      "bin/fiu-finance-mcp.js",
      "--url",
      `http://127.0.0.1:${address.port}/mcp`,
      "--api-key",
      "integration-key",
      "--allow-http",
      "--silent",
    ],
    { stdio: ["pipe", "pipe", "pipe"] },
  );
  t.after(() => {
    if (child.exitCode === null) child.kill();
  });

  const responsePromise = waitForJsonLine(child.stdout);
  child.stdin.write(
    `${JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "fiu-cli-test", version: "1.0.0" },
      },
    })}\n`,
  );

  const response = await responsePromise;
  assert.equal(response.result.serverInfo.name, "fiu-test-server");
  assert.equal(authorization, "Bearer integration-key");

  child.stdin.end();
});
