# Dependabot

Enable GitHub Dependabot dependabot_security_updates at the repo level.

Enable GitHub Dependabot .github/dependabot.yml for scheduled update PRs.

## Status: implemented 2026-08-29

- **Repo-level security updates**: `vulnerability-alerts` and
  `automated-security-fixes` enabled on `LilyDesignSystem/lily-design-system`
  via `gh api -X PUT repos/LilyDesignSystem/lily-design-system/{vulnerability-alerts,automated-security-fixes}`.
  Verified: `GET .../vulnerability-alerts` returns 204 (enabled);
  `GET .../automated-security-fixes` returns `{"enabled":true,"paused":false}`.
- **[.github/dependabot.yml](../../.github/dependabot.yml)**: 31 `updates`
  entries — one `github-actions` entry for `.github/workflows/`, 20 `npm`
  entries (one per pnpm-workspace root; each catalog's `pnpm-workspace.yaml`
  lets one entry cover its nested helper packages, per
  [helpers](../helpers/index.md); the helper-package entries instead list
  their top-level helper packages under `directories:`, since 2026-10-10), and 10 `nuget` entries (one per `.csproj`
  directory — NuGet has no workspace concept to consolidate them the way
  pnpm does). Every entry runs weekly and groups all its updates into a
  single PR (`groups: lily: patterns: ["*"]`), because one PR per outdated
  package across 31 directories would be dozens of PRs a week for a single
  maintainer.
- **Scope note**: this covers the canonical monorepo, which since 2026-10-10
  is the only source repository (the per-subproject subtree mirrors were
  deleted). The docs site's own repository (`lilydesignsystem.github.io`,
  pushed by `make github-pages`) gets no `.github/dependabot.yml` of its
  own; its dependencies are covered by this file's entry for its directory.

## Ignore rules and how a round is closed (2026-10-18)

`.github/dependabot.yml` carries `ignore` entries only where an update is known to break something, each with the reason in a comment:
`typescript` major versions (Angular and Vue tooling) in the example and catalog entries, (and, until 2026-10-18, `@axe-core/playwright` 4.14 in the Angular, Next and
SvelteKit examples: it found a real WCAG 2.5.3 defect in the headless `Editable`, fixed under `tasks.md` P11-T14, so the ignore is gone).

To close a round of grouped PRs without merging them one by one: apply every bump to the manifests in one pass (the same dependency across
all packages together, so a partial bump cannot fail restore, as the separate NuGet PRs did with NU1605), regenerate each lockfile, build and
test every changed package, run `bin/test`, push, and wait for CI on `main`. Dependabot then closes the superseded PRs itself; close any that
remain with a comment naming the commit.
