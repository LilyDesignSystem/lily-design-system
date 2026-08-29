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
  [helpers](../helpers/index.md)), and 10 `nuget` entries (one per `.csproj`
  directory — NuGet has no workspace concept to consolidate them the way
  pnpm does). Every entry runs weekly and groups all its updates into a
  single PR (`groups: lily: patterns: ["*"]`), because one PR per outdated
  package across 31 directories would be dozens of PRs a week for a single
  maintainer.
- **Scope note**: this covers the canonical monorepo only, not the 22
  published subtree repositories (see
  [special-files-for-public-repos](../special-files-for-public-repos/index.md)
  for that separate propagation problem — `.github/dependabot.yml` isn't a
  file `git subtree push` carries across, since `.github/` sits outside every
  subtree's prefix). Extending Dependabot coverage to the subtree repos is
  unscoped future work, not implied by this spec's text.
