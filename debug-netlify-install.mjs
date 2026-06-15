import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const sessionId = "e98063";
const endpoint =
  "http://127.0.0.1:7923/ingest/16d85f4a-c2d8-4200-85f0-73e97738ea97";
const shouldPrint = process.env.NETLIFY === "true" || process.env.DEBUG_NETLIFY_INSTALL === "1";
const runId = process.env.NETLIFY === "true"
  ? `netlify-${process.env.DEPLOY_ID ?? process.env.BUILD_ID ?? "unknown"}`
  : `local-${Date.now()}`;

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function getPackageLockDrift() {
  const packageJson = readJson("package.json");
  const packageLock = readJson("package-lock.json");
  const packageDeps = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
  };
  const lockRoot = packageLock?.packages?.[""] ?? {};
  const lockDeps = {
    ...lockRoot.dependencies,
    ...lockRoot.devDependencies,
  };
  const packageNames = Object.keys(packageDeps).sort();
  const lockNames = Object.keys(lockDeps).sort();

  return {
    dependencyCount: packageNames.length,
    lockDependencyCount: lockNames.length,
    missingFromLock: packageNames.filter((name) => !lockDeps[name]),
    staleSpecs: packageNames.filter(
      (name) => lockDeps[name] && lockDeps[name] !== packageDeps[name]
    ),
    extraInLock: lockNames.filter((name) => !packageDeps[name]),
  };
}

function getEsbuildState() {
  const binPath = join("node_modules", "esbuild", "bin", "esbuild");
  const packagePath = join("node_modules", "esbuild", "package.json");
  const packageJson = readJson(packagePath);

  if (!existsSync(binPath)) {
    return {
      binExists: false,
      packageVersion: packageJson?.version ?? null,
    };
  }

  const stats = statSync(binPath);

  return {
    binExists: true,
    isFile: stats.isFile(),
    mode: stats.mode,
    mtimeMs: stats.mtimeMs,
    packageVersion: packageJson?.version ?? null,
    size: stats.size,
  };
}

async function emit(message, hypothesisId, data) {
  const payload = {
    sessionId,
    runId,
    hypothesisId,
    location: "debug-netlify-install.mjs:emit",
    message,
    data,
    timestamp: Date.now(),
  };

  if (shouldPrint) {
    process.stdout.write(`[agent-debug] ${JSON.stringify(payload)}\n`);
  }

  await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": sessionId,
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

// #region agent log
await emit("install environment", "H1/H4/H5", {
  bunVersion: process.env.BUN_VERSION ?? null,
  ci: process.env.CI ?? null,
  netlify: process.env.NETLIFY ?? null,
  nodeVersion: process.versions.node,
  npmExecPath: process.env.npm_execpath
    ? basename(process.env.npm_execpath)
    : null,
  npmUserAgent: process.env.npm_config_user_agent ?? null,
});
// #endregion

// #region agent log
await emit("lockfile state", "H1/H2/H4", {
  bunLock: existsSync("bun.lock"),
  bunLockb: existsSync("bun.lockb"),
  packageLock: existsSync("package-lock.json"),
  packageLockDrift: getPackageLockDrift(),
});
// #endregion

// #region agent log
await emit("cached esbuild state", "H3/H5", getEsbuildState());
// #endregion
