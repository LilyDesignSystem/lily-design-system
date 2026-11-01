# Node current version

Node.js® is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.

Node current version is 26.

- If file `deploy.yml` exists and contains `node-version`, then set `node-version: 26`, then verify green (pnpm ci + pnpm run build success).
- If file `package.json` exists, then set: engines.node: ">=26" (a floor, not a pin: a pin made `pnpm install` fail under engine-strict for any consumer on a newer Node; changed 2026-10-18), then verify green locally.
- If file `.npmrc` exists, then set `engine-strict=true` so a gap can't occur, then verify failure (EBADENGINE) under node version 25, then verify success under node version 26 and later.
- If file `.nvmrc` exists, then pin the exact local dev version, scoped to this project only.
- If file `.tool-versions` exists, then pin the exact local dev version, scoped to this project only.

## Acceptance criteria

- [x] All 167 `package.json` files declare `engines.node: ">=26"` (checked 2026-10-30).
- [x] Every `node-version` in `.github/workflows/ci.yml` and `publish.yml` is 26 (four jobs still set 22 until 2026-10-30).
- [x] No `.npmrc`, `.nvmrc` or `.tool-versions` exists in the repository, so those rules do not apply; with no `engine-strict`,
      pnpm warns rather than fails on an older Node.

## Related topics

[dependabot](../dependabot/index.md) · [tooling](../tooling/index.md) · [trusted-publishing](../trusted-publishing/index.md)
