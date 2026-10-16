import { afterEach, expect, setDefaultTimeout, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

setDefaultTimeout(30_000);

const node = execFileSync("which", ["node"], { encoding: "utf8" }).trim();
const temporaryDirectories: string[] = [];
const validEnv =
  "NEXT_PUBLIC_SANITY_PROJECT_ID=fixture\nNEXT_PUBLIC_SANITY_DATASET=production\nSANITY_API_READ_TOKEN=private-fixture-token\n";

afterEach(() => {
  for (const path of temporaryDirectories.splice(0)) {
    rmSync(path, { recursive: true, force: true });
  }
});

function fixture() {
  const base = mkdtempSync(join(tmpdir(), "worktree setup "));
  temporaryDirectories.push(base);
  const source = join(base, "primary checkout");
  const worktree = join(base, "linked checkout");
  const bin = join(base, "bin");
  mkdirSync(join(source, "scripts"), { recursive: true });
  mkdirSync(bin);
  copyFileSync(
    new URL("./setup-worktree.mjs", import.meta.url),
    join(source, "scripts/setup-worktree.mjs")
  );
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: source, stdio: "pipe" });
  git("init", "--quiet");
  git("add", "scripts");
  git(
    "-c",
    "user.name=Test",
    "-c",
    "user.email=test@example.invalid",
    "commit",
    "--quiet",
    "-m",
    "Fixture"
  );
  git("worktree", "add", "--detach", worktree, "HEAD");
  mkdirSync(join(worktree, "node_modules"));
  symlinkSync(
    dirname(require.resolve("next/package.json")),
    join(worktree, "node_modules/next")
  );
  writeFileSync(
    join(bin, "fake-bun.cjs"),
    `const fs = require('node:fs');\nif (process.argv.includes('install')) {\n fs.writeFileSync('install.json', JSON.stringify({args: process.argv.slice(2), mode: process.env.NODE_ENV}));\n process.exit(Number(process.env.FIXTURE_INSTALL_EXIT || 0));\n}\n`,
    { mode: 0o755 }
  );
  writeFileSync(
    join(bin, "bun"),
    `#!/bin/sh\nexec '${node.replaceAll("'", "'\\''")}' '${join(bin, "fake-bun.cjs")}' "$@"\n`,
    { mode: 0o755 }
  );
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    NODE_ENV: "production",
  };
  for (const key of [
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "SANITY_API_READ_TOKEN",
    "__NEXT_PROCESSED_ENV",
  ]) {
    delete env[key];
  }
  const run = (overrides: Record<string, string> = {}) =>
    spawnSync(node, [join(worktree, "scripts/setup-worktree.mjs")], {
      cwd: tmpdir(),
      env: { ...env, ...overrides },
      encoding: "utf8",
    });
  return { source, worktree, run, bin };
}

test("copies dotenv files privately, installs dev dependencies, and reruns without overwriting", () => {
  const { source, worktree, run } = fixture();
  writeFileSync(join(source, ".env.local"), validEnv);
  writeFileSync(join(source, ".env.production.local"), "EXTRA=production\n");
  const result = run();
  expect(result.status).toBe(0);
  expect(result.stdout + result.stderr).not.toContain("private-fixture-token");
  expect(readFileSync(join(worktree, ".env.local"), "utf8")).toBe(validEnv);
  expect(statSync(join(worktree, ".env.local")).mode % 0o1000).toBe(0o600);
  expect(readFileSync(join(worktree, ".env.production.local"), "utf8")).toBe(
    "EXTRA=production\n"
  );
  expect(
    JSON.parse(readFileSync(join(worktree, "install.json"), "utf8"))
  ).toEqual({ args: ["install", "--frozen-lockfile"], mode: "development" });
  writeFileSync(join(source, ".env.local"), "changed source");
  expect(run().status).toBe(0);
  expect(readFileSync(join(worktree, ".env.local"), "utf8")).toBe(validEnv);
});

test("preserves existing regular files and valid or dangling symlinks", () => {
  const { source, worktree, run } = fixture();
  writeFileSync(
    join(source, ".env.local"),
    "source must not replace destination"
  );
  writeFileSync(join(worktree, ".env.local"), validEnv);
  writeFileSync(join(source, ".env.production"), "SECRET=source");
  symlinkSync(join(worktree, "absent"), join(worktree, ".env.production"));
  writeFileSync(join(source, ".env.test"), "SECRET=source");
  const target = join(worktree, "shared-env");
  writeFileSync(target, "SECRET=destination");
  symlinkSync(target, join(worktree, ".env.test"));
  expect(run().status).toBe(0);
  expect(readFileSync(join(worktree, ".env.local"), "utf8")).toBe(validEnv);
  expect(lstatSync(join(worktree, ".env.production")).isSymbolicLink()).toBe(
    true
  );
  expect(lstatSync(join(worktree, ".env.test")).isSymbolicLink()).toBe(true);
  expect(readFileSync(target, "utf8")).toBe("SECRET=destination");
});

test("removes a partial copy after write failure and retries without exposing secrets", () => {
  const { source, worktree, run, bin } = fixture();
  const destination = join(worktree, ".env.local");
  const marker = join(bin, "partial-write");
  const preload = join(bin, "fail-write.cjs");
  writeFileSync(join(source, ".env.local"), validEnv);
  writeFileSync(join(source, ".env"), "EXISTING=source\n");
  writeFileSync(join(worktree, ".env"), "EXISTING=destination\n");
  symlinkSync(join(worktree, "absent"), join(worktree, ".env.production"));
  writeFileSync(join(source, ".env.production"), "SECRET=source\n");
  writeFileSync(
    preload,
    `const fs = require('node:fs');
const { syncBuiltinESMExports } = require('node:module');
const originalWrite = fs.writeFileSync;
fs.writeFileSync = function (file, contents, ...args) {
  if (typeof file === 'number') {
    const bytes = fs.writeSync(file, contents, 0, 16);
    originalWrite(${JSON.stringify(marker)}, String(bytes));
    throw Object.assign(new Error('ENOSPC private-fixture-token'), { code: 'ENOSPC' });
  }
  return originalWrite(file, contents, ...args);
};
syncBuiltinESMExports();
`
  );

  const failed = run({ NODE_OPTIONS: `--require ${JSON.stringify(preload)}` });
  expect(failed.status).toBe(1);
  expect(failed.stderr).toContain("Could not copy .env.local");
  expect(failed.stdout + failed.stderr).not.toContain("private-fixture-token");
  expect(readFileSync(marker, "utf8")).toBe("16");
  expect(existsSync(destination)).toBe(false);
  expect(existsSync(join(worktree, "install.json"))).toBe(false);

  const retried = run();
  expect(retried.status).toBe(0);
  expect(retried.stdout + retried.stderr).not.toContain(
    "private-fixture-token"
  );
  expect(readFileSync(destination, "utf8")).toBe(validEnv);
  expect(statSync(destination).mode % 0o1000).toBe(0o600);
  expect(readFileSync(join(worktree, ".env"), "utf8")).toBe(
    "EXISTING=destination\n"
  );
  expect(lstatSync(join(worktree, ".env.production")).isSymbolicLink()).toBe(
    true
  );
});

test("uses Next development precedence, expansion and inherited variables", () => {
  const { source, run } = fixture();
  writeFileSync(join(source, ".env"), validEnv);
  writeFileSync(join(source, ".env.local"), "SANITY_API_READ_TOKEN=\n");
  writeFileSync(
    join(source, ".env.development.local"),
    "TOKEN=development\nSANITY_API_READ_TOKEN=$TOKEN\n"
  );
  expect(run().status).toBe(0);
  const result = run({ SANITY_API_READ_TOKEN: "" });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain(
    "Missing required environment variables: SANITY_API_READ_TOKEN"
  );
});

test("accepts inherited env without dotenv files and reports missing variables", () => {
  const { run } = fixture();
  expect(run().stderr).toContain("Missing required environment variables");
  expect(
    run({
      NEXT_PUBLIC_SANITY_PROJECT_ID: "fixture",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_API_READ_TOKEN: "inherited",
    }).status
  ).toBe(0);
});

test("fails helpfully when installation fails or Bun is missing", () => {
  const { run, bin } = fixture();
  const failedInstall = run({ FIXTURE_INSTALL_EXIT: "7" });
  expect(failedInstall.status).toBe(1);
  expect(failedInstall.stderr).toContain("Dependency installation failed");
  rmSync(join(bin, "bun"));
  const missingBun = run({ PATH: bin });
  expect(missingBun.status).toBe(1);
  expect(missingBun.stderr).toContain("Bun is required");
});
