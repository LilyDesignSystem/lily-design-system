# Trusted Publishing

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Trusted Publishing lets a CI workflow authenticate to a
package registry with a short-lived OpenID Connect (OIDC) token that
cryptographically proves *which repository and workflow* is publishing —
instead of a long-lived API token stored as a secret that can leak,
be exfiltrated, or outlive its purpose. Lily **intends to adopt it, and
has not yet**: the standing position is to switch when it is
production-ready across the forges this project publishes from and the
registries it publishes to, and that bar is not met as of 2026-08.

## Scope

This topic covers the adoption position, the current credential posture
it will replace, the per-registry/per-forge readiness picture, and the
adoption checklist. The publish pipelines themselves are
[docs/releasing.md](../../docs/releasing.md) and
[`.github/workflows/publish.yml`](../../.github/workflows/publish.yml);
the credential inventory and its single-holder honesty is
[MAINTAINERS.md](../../MAINTAINERS.md).

## Principles and rules

- **Adopt when the whole fan-out is covered, not before.** Lily pushes
  source to three forges (GitHub, GitLab, Codeberg) and packages to two
  registries (npm, NuGet). A Trusted Publishing setup that works only
  for one forge–registry pair would concentrate publishing on that pair
  and quietly demote the others from peers to mirrors — the opposite of
  the three-forge posture MAINTAINERS.md records as the project's real
  continuity strength.
- **Provenance now, tokens until then.** The publish workflow already
  requests `id-token: write` and publishes npm packages with
  `--provenance`, which attests *where a package was built* even while
  authentication still uses a token. Trusted Publishing replaces the
  token; it does not replace provenance — the two compose.
- **Tokens are scoped and named while they last.** `NPM_TOKEN` (npm
  automation token) and `NUGET_API_KEY` live only as CI secrets and in
  the maintainer's keychain, are named in the credential inventory, and
  publishing for real requires an explicit manual dispatch — a tag
  alone never ships bytes.
- **Who may decide to publish is a separate question from how the credential
  works, and it is answered elsewhere.** An agentic Claude Code session is
  authorized to decide a specific, already-prepared release meets the
  readiness criteria and to execute the publish for real — see
  [GOVERNANCE.md](../../GOVERNANCE.md) § AI agent publish authority and
  [AI_STATEMENT.md](../../AI_STATEMENT.md) §5. That authorization is
  unaffected by whether authentication is a long-lived token or, once
  adopted, Trusted Publishing's short-lived OIDC token — both authenticate
  the same publish step, whoever decided to run it.

## Readiness picture (as of 2026-08)

| Registry | Trusted Publishing state | Covers our forges? |
| --- | --- | --- |
| npm | OIDC trusted publishing available for GitHub Actions and GitLab CI/CD | GitHub ✔, GitLab ✔, Codeberg ✘ (Forgejo Actions is not a supported provider) |
| NuGet | Trusted Publishing available for GitHub Actions | GitHub ✔, GitLab ✘, Codeberg ✘ |
| (crates.io) | Supported for GitHub Actions — noted because this position is shared across the maintainer's projects; Lily ships no Rust | n/a |

The bar — "production-ready across all our code forges and all our
target destinations" — therefore fails today on Codeberg for both
registries and on GitLab for NuGet. Re-check this table when any
provider announcement lands; the acceptance criteria below are the
adoption trigger.

## Adoption checklist (when the bar is met)

1. Configure the trusted publisher on npm for each of the 36 package
   names (org-level where npm allows it) and on nuget.org for the
   `LilyDesignSystem.Blazor.*` ids, bound to this repository and the
   `publish.yml` workflow.
2. Remove `NPM_TOKEN` and `NUGET_API_KEY` from repository secrets;
   update `publish.yml` (the `NODE_AUTH_TOKEN`/`--api-key` plumbing
   goes; `id-token: write` stays).
3. Update [docs/releasing.md](../../docs/releasing.md) § Credentials,
   [SECURITY.md](../../SECURITY.md)'s posture table, and
   [MAINTAINERS.md](../../MAINTAINERS.md)'s publishing-identities table
   in the same commit — the FerroEHR-style honesty rule: the inventory
   describes what exists, the day it exists.
4. Revoke the retired long-lived tokens at the registries.

## Acceptance criteria

- [ ] npm Trusted Publishing supports every forge this project treats
      as a peer (GitHub, GitLab, Codeberg), or the project has
      explicitly revised its peer-forge position first.
- [ ] NuGet Trusted Publishing likewise.
- [ ] Trusted publishers configured for all package names; long-lived
      tokens removed and revoked; docs updated in the same commit.
- [x] Until then: npm publishes carry `--provenance`; publishing
      requires explicit manual dispatch; tokens exist only as named CI
      secrets with their holder recorded.

## Related topics

- [free-open-source-funding](../free-open-source-funding/index.md) — the same
  pattern of a staged capability with an explicit go-live edit.
- [special-files-for-public-repos](../special-files-for-public-repos/index.md) —
  SECURITY.md and MAINTAINERS.md, which must change in the adoption commit,
  are synced files.

## Sources

- [docs/releasing.md](../../docs/releasing.md) § Credentials
- [.github/workflows/publish.yml](../../.github/workflows/publish.yml)
- [MAINTAINERS.md](../../MAINTAINERS.md) § Publishing identities
- [SECURITY.md](../../SECURITY.md) § Repository security settings

---

Lily™ and Lily Design System™ are trademarks.
