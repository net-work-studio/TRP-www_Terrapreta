import { spawnSync } from "node:child_process";
import {
  closeSync,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const envFiles = [
  ".env",
  ".env.local",
  ...["development", "production", "test"].flatMap((mode) => [
    `.env.${mode}`,
    `.env.${mode}.local`,
  ]),
];
const requiredVariables = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_READ_TOKEN",
];

function exists(path) {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function copyEnvironment(sourceRoot) {
  for (const name of envFiles) {
    const source = join(sourceRoot, name);
    const destination = join(root, name);
    // lstat also preserves dangling destination symlinks.
    if (exists(destination) || !exists(source)) {
      continue;
    }
    let sourceFd;
    let destinationFd;
    try {
      sourceFd = openSync(source, "r");
      if (!fstatSync(sourceFd).isFile()) {
        throw new Error("Not a regular file");
      }
      const contents = readFileSync(sourceFd);
      // Exclusive creation prevents overwriting a file or following a symlink.
      destinationFd = openSync(destination, "wx", 0o600);
      writeFileSync(destinationFd, contents);
    } catch (error) {
      // Only remove files created by this attempt so a partial write can retry.
      if (destinationFd !== undefined) {
        unlinkSync(destination);
      }
      if (error.code !== "EEXIST") {
        throw new Error(
          `Could not copy ${name}. Check source readability and destination permissions.`,
          { cause: error }
        );
      }
    } finally {
      if (sourceFd !== undefined) {
        closeSync(sourceFd);
      }
      if (destinationFd !== undefined) {
        closeSync(destinationFd);
      }
    }
  }
}

function setup() {
  const version = spawnSync("bun", ["--version"], { cwd: root });
  if (version.error || version.status !== 0) {
    throw new Error(
      "Bun is required. Install Bun and ensure it is on PATH, then rerun setup."
    );
  }

  const git = spawnSync("git", ["worktree", "list", "--porcelain", "-z"], {
    cwd: root,
    encoding: "utf8",
  });
  const firstRecord = git.stdout?.split("\0")[0];
  if (git.status !== 0 || !firstRecord?.startsWith("worktree ")) {
    throw new Error(
      "Cannot locate the primary checkout. Run setup inside a Git worktree with Git on PATH."
    );
  }
  copyEnvironment(firstRecord.slice("worktree ".length));

  const install = spawnSync("bun", ["install", "--frozen-lockfile"], {
    cwd: root,
    env: { ...process.env, NODE_ENV: "development" },
    stdio: "inherit",
  });
  if (install.error || install.status !== 0) {
    throw new Error(
      "Dependency installation failed. Check Bun's output above, then rerun setup; do not regenerate bun.lock."
    );
  }

  // Resolve Next's own loader after installation; no bootstrap dependencies.
  const require = createRequire(import.meta.url);
  const nextRequire = createRequire(require.resolve("next/package.json"));
  const { loadEnvConfig } = nextRequire("@next/env");
  process.env.NODE_ENV = "development";
  let envLoadFailed = false;
  const { combinedEnv } = loadEnvConfig(root, true, {
    info() {
      // Keep setup output free of dotenv contents.
    },
    error() {
      envLoadFailed = true;
    },
  });
  if (envLoadFailed) {
    throw new Error(
      "Could not load dotenv configuration. Check file permissions, symlinks and variable expansions."
    );
  }
  const missing = requiredVariables.filter(
    (name) => !combinedEnv[name]?.trim()
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. Set them in .env.local or the shell, then rerun setup.`
    );
  }
  process.stdout.write("Worktree ready. Run bun run dev.\n");
}

try {
  setup();
} catch (error) {
  process.stderr.write(`Worktree setup failed: ${error.message}\n`);
  process.exitCode = 1;
}
