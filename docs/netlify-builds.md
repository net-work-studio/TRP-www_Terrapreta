# Netlify build skips

Netlify runs `scripts/netlify-ignore-build.mjs` before each Git-triggered build. It skips the build when every file changed since the previous built commit belongs to one of these paths:

- Markdown files at the repository root
- `docs/` and `.migration/`
- `.agents/`, `.claude/`, `.cursor/`, and `.vscode/`
- `skills-lock.json`

Any change outside those paths runs the normal build. A commit that changes both documentation and site code also runs the build. The rule applies to production builds, branch deploys, and deploy previews.

Skipping a build cancels that Git deploy, so it creates no new deploy or preview. Netlify build hooks still run. If Netlify has no previous built commit to compare, or Git cannot compare the commits, the build runs.

If the site starts reading files from any skipped path, update the path list in the script. See [Netlify's ignore builds documentation](https://docs.netlify.com/build/configure-builds/ignore-builds/) for how Netlify handles the command's exit codes.
