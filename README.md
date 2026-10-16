[![Netlify Status](https://api.netlify.com/api/v1/badges/5167bcc9-7212-4cc1-97b8-bc3e5490b65b/deploy-status)](https://app.netlify.com/projects/terrapreta/deploys)

# Terrapreta Website

## Local worktree setup

With Node >=22.12, Bun and Git on PATH, run:

```sh
bun --no-env-file run setup:worktree
bun run dev
```

In T3 Code, [t3.json](./t3.json) defines the worktree setup action. Import
**Setup worktree** once via project **Actions → Import scripts**, under **Import
from t3.json**, replacing any existing setup action. It runs automatically on new
worktrees and finishes before the agent starts. Keep the required environment
variables in the primary checkout's `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID`,
`NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN`.

Setup discovers the primary checkout through Git, copies missing root `.env`,
`.env.local`, and development/production/test dotenv variants with owner-only
permissions, and preserves existing files and symlinks. It installs dependencies
(including dev dependencies) using `bun install --frozen-lockfile`, then checks
required variables using Next's development env precedence, including inherited
shell variables. `--no-env-file` prevents Bun from preloading dotenv values ahead
of Next's loader. No secret values are printed. Rerun safely after fixing an error;
existing env files are never refreshed automatically. `bun run dev` already runs
Sanity type generation through `predev`.
