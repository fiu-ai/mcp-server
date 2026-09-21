import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DEFAULT_URL,
  buildProxyInvocation,
  main,
  parseArgs,
  resolveProxyBin,
} from "../src/cli.js";

test("uses environment defaults and passes advanced options through", () => {
  const parsed = parseArgs(
    ["--debug", "--connect-timeout", "20"],
    { FIU_API_KEY: "env-key" },
  );

  assert.equal(parsed.apiKey, "env-key");
  assert.equal(parsed.url, DEFAULT_URL);
  assert.deepEqual(parsed.forwarded, ["--debug", "--connect-timeout", "20"]);
});

test("CLI options override environment values", () => {
  const parsed = parseArgs(
    ["--api-key=cli-key", "--url", "https://example.test/mcp"],
    { FIU_API_KEY: "env-key", FIU_MCP_URL: "https://old.test/mcp" },
  );

  assert.equal(parsed.apiKey, "cli-key");
  assert.equal(parsed.url, "https://example.test/mcp");
});

test("builds an HTTP-only proxy invocation without exposing the key", () => {
  const options = parseArgs(
    ["--header", "X-Tenant: demo", "--keep-alive"],
    { FIU_API_KEY: "secret-key" },
  );
  const { proxyArgs, childEnv } = buildProxyInvocation(options, {});

  assert.deepEqual(proxyArgs, [
    DEFAULT_URL,
    "--transport",
    "http-only",
    "--header",
    "Authorization:${FIU_MCP_AUTH_TOKEN}",
    "--header",
    "X-Tenant: demo",
    "--keep-alive",
  ]);
  assert.equal(childEnv.FIU_MCP_AUTH_TOKEN, "Bearer secret-key");
  assert.equal(proxyArgs.join(" ").includes("secret-key"), false);
});

test("accepts an explicit Authorization header without an API key", () => {
  const options = parseArgs(
    ["--header=Authorization:Bearer custom-token"],
    {},
  );
  const { proxyArgs } = buildProxyInvocation(options, {});

  assert.equal(
    proxyArgs.includes("Authorization:Bearer custom-token"),
    true,
  );
});

test("rejects a missing API key and invalid URL", () => {
  assert.throws(
    () => buildProxyInvocation(parseArgs([], {}), {}),
    /Missing API key/,
  );
  assert.throws(
    () =>
      buildProxyInvocation(
        parseArgs(["--url", "file:///tmp/mcp"], { FIU_API_KEY: "key" }),
        {},
      ),
    /must use http:\/\/ or https:\/\//,
  );
});

test("resolves the installed mcp-remote executable", () => {
  assert.match(resolveProxyBin(), /mcp-remote[\\/]dist[\\/]proxy\.js$/);
});

test("main starts the proxy with Node and inherits stdio", async () => {
  let invocation;
  let headerFileContents;
  const spawnImpl = (command, args, options) => {
    invocation = { command, args, options };
    const headerFileIndex = args.indexOf("--header-file") + 1;
    headerFileContents = readFileSync(args[headerFileIndex], "utf8");
    const child = new EventEmitter();
    queueMicrotask(() => child.emit("close", 0, null));
    return child;
  };

  const exitCode = await main({
    args: ["--debug"],
    env: { FIU_API_KEY: "test-key" },
    spawnImpl,
  });

  assert.equal(exitCode, 0);
  assert.equal(invocation.command, process.execPath);
  assert.match(invocation.args[0], /mcp-remote[\\/]dist[\\/]proxy\.js$/);
  assert.deepEqual(invocation.args.slice(1, 4), [
    DEFAULT_URL,
    "--transport",
    "http-only",
  ]);
  assert.match(invocation.args[5], /headers\.txt$/);
  assert.equal(headerFileContents, "Authorization:Bearer test-key\n");
  assert.equal(invocation.args.join(" ").includes("test-key"), false);
  assert.equal(invocation.options.stdio, "inherit");
});
