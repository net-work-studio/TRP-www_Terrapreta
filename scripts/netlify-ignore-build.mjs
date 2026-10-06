import { execFileSync } from "node:child_process";

const { CACHED_COMMIT_REF, COMMIT_REF } = process.env;
const ROOT_MARKDOWN_FILE = /^[^/]+\.md$/i;

// Netlify uses the current commit as the cached ref when there is no build cache.
if (!(CACHED_COMMIT_REF && COMMIT_REF) || CACHED_COMMIT_REF === COMMIT_REF) {
  console.log("Build: no previous build commit is available for comparison.");
  process.exit(1);
}

const isDocumentationOrTooling = (path) =>
  ROOT_MARKDOWN_FILE.test(path) ||
  ["docs/", ".migration/", ".agents/", ".claude/", ".cursor/", ".vscode/"].some(
    (directory) => path.startsWith(directory)
  ) ||
  path === "skills-lock.json";

try {
  const changedFiles = execFileSync(
    "git",
    [
      "diff",
      "--name-only",
      "--no-renames",
      "-z",
      CACHED_COMMIT_REF,
      COMMIT_REF,
      "--",
    ],
    { encoding: "utf8" }
  )
    .split("\0")
    .filter(Boolean);

  if (changedFiles.every(isDocumentationOrTooling)) {
    console.log(
      "Skip build: only documentation or agent/editor files changed."
    );
    process.exit(0);
  }

  console.log("Build: site or deployment files changed.");
  process.exit(1);
} catch (error) {
  console.error("Build: could not compare Git commits.", error);
  process.exit(1);
}
