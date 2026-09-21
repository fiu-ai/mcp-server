import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const DEFAULT_URL = "https://ai.szfiu.com/api/mcp/v2";
const AUTH_ENV_NAME = "FIU_MCP_AUTH_TOKEN";
const require = createRequire(import.meta.url);

const HELP = `FIU Finance MCP CLI

Bridges a local stdio MCP client to the hosted FIU Streamable HTTP service.

Usage:
  fiu-finance-mcp [options] [mcp-remote options]
  npx fiu-finance-mcp [options]

Options:
  -k, --api-key <key>  FIU API key (prefer the FIU_API_KEY environment variable)
  -u, --url <url>      Remote MCP URL (default: ${DEFAULT_URL})
      --header <value> Add an HTTP header; repeatable
      --debug          Enable mcp-remote debug logging
      --silent         Suppress non-error mcp-remote logs
  -h, --help           Show this help
  -v, --version        Show the package version

Environment:
  FIU_API_KEY          FIU API key
  FIU_MCP_URL          Override the remote MCP URL

Any unrecognized arguments are passed to mcp-remote. Common examples include
--connect-timeout <seconds>, --headers-timeout <seconds>, --body-timeout
<seconds>, --keep-alive, --ping-interval <seconds>, --ipv4 and --debug.
`;

function takeValue(args, index, option) {
  const value = args[index + 1];
  if (value === undefined || value.startsWith("-")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

export function parseArgs(args, env = process.env) {
  let apiKey = env.FIU_API_KEY?.trim() || "";
  let url = env.FIU_MCP_URL?.trim() || DEFAULT_URL;
  let help = false;
  let version = false;
  const headers = [];
  const forwarded = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--") {
      forwarded.push(...args.slice(index + 1));
      break;
    }
    if (arg === "-h" || arg === "--help") {
      help = true;
      continue;
    }
    if (arg === "-v" || arg === "--version") {
      version = true;
      continue;
    }
    if (arg === "-k" || arg === "--api-key") {
      apiKey = takeValue(args, index, arg);
      index += 1;
      continue;
    }
    if (arg.startsWith("--api-key=")) {
      apiKey = arg.slice("--api-key=".length);
      continue;
    }
    if (arg === "-u" || arg === "--url") {
      url = takeValue(args, index, arg);
      index += 1;
      continue;
    }
    if (arg.startsWith("--url=")) {
      url = arg.slice("--url=".length);
      continue;
    }
    if (arg === "--header") {
      headers.push(takeValue(args, index, arg));
      index += 1;
      continue;
    }
    if (arg.startsWith("--header=")) {
      headers.push(arg.slice("--header=".length));
      continue;
    }

    forwarded.push(arg);
  }

  return { apiKey, url, headers, forwarded, help, version };
}

function validateUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid MCP URL: ${value}`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("MCP URL must use http:// or https://");
  }

  return parsed.toString();
}

export function buildProxyInvocation(options, env = process.env) {
  const url = validateUrl(options.url);
  const childEnv = { ...env };
  const hasAuthorizationHeader = options.headers.some((header) =>
    /^authorization\s*:/i.test(header),
  );
  const headers = [...options.headers];

  if (!hasAuthorizationHeader) {
    const apiKey = options.apiKey.trim();
    if (!apiKey) {
      throw new Error(
        "Missing API key. Set FIU_API_KEY or pass --api-key <key>.",
      );
    }
    childEnv[AUTH_ENV_NAME] = `Bearer ${apiKey}`;
    headers.unshift(`Authorization:\${${AUTH_ENV_NAME}}`);
  }

  const proxyArgs = [url, "--transport", "http-only"];
  for (const header of headers) {
    proxyArgs.push("--header", header);
  }
  proxyArgs.push(...options.forwarded);

  return { proxyArgs, childEnv };
}

export function resolveProxyBin() {
  const packageJsonPath = require.resolve("mcp-remote/package.json");
  const packageJson = require(packageJsonPath);
  const binPath =
    typeof packageJson.bin === "string"
      ? packageJson.bin
      : packageJson.bin?.["mcp-remote"];

  if (!binPath) {
    throw new Error("The installed mcp-remote package has no executable entry.");
  }

  return resolve(dirname(packageJsonPath), binPath);
}

export function runProxy(proxyBin, proxyArgs, childEnv, spawnImpl = spawn) {
  return prepareHeaders(proxyArgs, childEnv).then(
    async ({ args, temporaryDirectory }) => {
      try {
        return await new Promise((resolveExitCode, reject) => {
          const child = spawnImpl(process.execPath, [proxyBin, ...args], {
            stdio: "inherit",
            env: childEnv,
            windowsHide: true,
          });

          child.once("error", reject);
          child.once("close", (code, signal) => {
            if (signal) {
              reject(new Error(`mcp-remote stopped after receiving ${signal}`));
              return;
            }
            resolveExitCode(code ?? 1);
          });
        });
      } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
      }
    },
  );
}

async function prepareHeaders(proxyArgs, childEnv) {
  const args = [];
  const headers = [];

  for (let index = 0; index < proxyArgs.length; index += 1) {
    if (proxyArgs[index] !== "--header") {
      args.push(proxyArgs[index]);
      continue;
    }

    const rawHeader = proxyArgs[index + 1];
    if (
      rawHeader === undefined ||
      /[\r\n]/.test(rawHeader) ||
      !/^[A-Za-z0-9_-]+:\s*.*$/.test(rawHeader)
    ) {
      throw new Error("HTTP headers must be single-line Name:Value strings");
    }
    headers.push(
      rawHeader.replace(/\$\{([^}]+)}/g, (match, name) => {
        if (!(name in childEnv)) {
          throw new Error(`Missing environment variable ${name} used by a header`);
        }
        return childEnv[name];
      }),
    );
    index += 1;
  }

  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), "fiu-finance-mcp-"),
  );
  const headerFile = join(temporaryDirectory, "headers.txt");
  try {
    await writeFile(headerFile, `${headers.join("\n")}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch (error) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    throw error;
  }
  args.splice(3, 0, "--header-file", headerFile);

  return { args, temporaryDirectory };
}

function packageVersion() {
  const packageJson = require("../package.json");
  return packageJson.version;
}

export async function main({
  args = process.argv.slice(2),
  env = process.env,
  stdout = process.stdout,
  stderr = process.stderr,
  spawnImpl = spawn,
} = {}) {
  try {
    const options = parseArgs(args, env);
    if (options.help) {
      stdout.write(HELP);
      return 0;
    }
    if (options.version) {
      stdout.write(`${packageVersion()}\n`);
      return 0;
    }

    const { proxyArgs, childEnv } = buildProxyInvocation(options, env);
    return await runProxy(resolveProxyBin(), proxyArgs, childEnv, spawnImpl);
  } catch (error) {
    stderr.write(`fiu-finance-mcp: ${error.message}\n`);
    return 1;
  }
}

export { DEFAULT_URL, HELP };
