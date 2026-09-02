# Trusted Publishing

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Trusted Publishing lets a CI workflow authenticate to a
package registry with a short-lived OpenID Connect (OIDC) token that
cryptographically proves *which repository and workflow* is publishing —
instead of a long-lived API token stored as a secret that can leak,
be exfiltrated, or outlive its purpose. Lily's standing position is to
switch when it is production-ready across the forges this project
publishes from and the registries it publishes to — full adoption
still isn't met as of 2026-09. **NuGet is the one deliberate exception**:
GitHub was already the only forge that could publish to NuGet at all
(GitLab and Codeberg were both ✘ in the readiness table below before
and after this change), so adopting Trusted Publishing there converts
an existing GitHub-only capability to a safer credential without
demoting GitLab or Codeberg from peer to mirror on anything they could
already do — the concern the "whole fan-out" principle exists to guard
against simply doesn't apply to a registry neither of them could reach
in the first place. npm remains on `NPM_TOKEN` because npm's fan-out
gap (Codeberg) is real and unresolved.

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
  automation token) lives only as a CI secret and in the maintainer's
  keychain, is named in the credential inventory, and publishing for
  real requires an explicit manual dispatch — a tag alone never ships
  bytes. NuGet no longer has an equivalent long-lived secret (see below).
- **Who may decide to publish is a separate question from how the credential
  works, and it is answered elsewhere.** An agentic Claude Code session is
  authorized to decide a specific, already-prepared release meets the
  readiness criteria and to execute the publish for real — see
  [GOVERNANCE.md](../../GOVERNANCE.md) § AI agent publish authority and
  [AI_STATEMENT.md](../../AI_STATEMENT.md) §5. That authorization is
  unaffected by whether authentication is a long-lived token or, once
  adopted, Trusted Publishing's short-lived OIDC token — both authenticate
  the same publish step, whoever decided to run it.

## Readiness picture (as of 2026-09)

| Registry | Trusted Publishing state | Covers our forges? |
| --- | --- | --- |
| npm | OIDC trusted publishing available for GitHub Actions and GitLab CI/CD | GitHub ✔, GitLab ✔, Codeberg ✘ (Forgejo Actions is not a supported provider) — **not yet adopted**, `NPM_TOKEN` still in use |
| NuGet | Trusted Publishing available for GitHub Actions | GitHub ✔ — **adopted 2026-09** via [`NuGet/login@v1`](https://github.com/NuGet/login) in `publish.yml`, `NUGET_API_KEY` retired as a secret. GitLab ✘, Codeberg ✘, unchanged — neither forge could publish to NuGet before this change either, so nothing was demoted |
| (crates.io) | Supported for GitHub Actions — noted because this position is shared across the maintainer's projects; Lily ships no Rust | n/a |

The "whole fan-out" bar still gates npm: Codeberg has no supported OIDC
provider, so npm keeps `NPM_TOKEN` until that changes or the project
revises its peer-forge position. NuGet was pulled out of that bar
because the fan-out gap it would otherwise measure doesn't exist for
NuGet — GitHub was already the only forge in the picture.

## Adoption checklist

Completed for NuGet (2026-09):

1. ~~Configure the trusted publisher on nuget.org for the
   `LilyDesignSystem.Blazor.*` ids, bound to `LilyDesignSystem/lily-design-system`
   and the `publish.yml` workflow (no environment).~~ Requires the
   maintainer's one-time setup at
   [nuget.org/account/trustedpublishing](https://www.nuget.org/account/trustedpublishing) —
   see [docs/releasing.md](../../docs/releasing.md).
2. ~~Add a `NuGet/login@v1` step to `publish.yml` (real-mode only,
   `id-token: write` already present) and point the publish steps'
   `NUGET_API_KEY` env at `steps.nuget-login.outputs.NUGET_API_KEY`
   instead of a secret.~~ Done.
3. ~~Remove `NUGET_API_KEY` from repository secrets; add `NUGET_USER`
   (the maintainer's nuget.org profile name) instead.~~ Workflow side
   done; the secret swap is the maintainer's action outside this repo.
4. ~~Update [MAINTAINERS.md](../../MAINTAINERS.md)'s publishing-identities
   table in the same change~~ — done.

Still open, for npm, when the bar below is met:

1. Configure the trusted publisher on npm for each of the 36 package
   names (org-level where npm allows it), bound to this repository and
   the `publish.yml` workflow.
2. Remove `NPM_TOKEN` from repository secrets; update `publish.yml`
   (the `NODE_AUTH_TOKEN` plumbing goes; `id-token: write` stays).
3. Update [docs/releasing.md](../../docs/releasing.md) § Credentials,
   [SECURITY.md](../../SECURITY.md)'s posture table, and
   [MAINTAINERS.md](../../MAINTAINERS.md)'s publishing-identities table
   in the same commit — the FerroEHR-style honesty rule: the inventory
   describes what exists, the day it exists.
4. Revoke the retired long-lived token at npm.

## Acceptance criteria

- [ ] npm Trusted Publishing supports every forge this project treats
      as a peer (GitHub, GitLab, Codeberg), or the project has
      explicitly revised its peer-forge position first.
- [x] NuGet Trusted Publishing adopted for GitHub (the only forge that
      was ever in scope for NuGet); `NUGET_API_KEY` retired from
      `publish.yml` in favour of `NuGet/login@v1` + `NUGET_USER`.
- [ ] npm: trusted publishers configured for all package names;
      `NPM_TOKEN` removed and revoked; docs updated in the same commit.
- [x] Until npm adopts: npm publishes carry `--provenance`; publishing
      requires explicit manual dispatch; `NPM_TOKEN` exists only as a
      named CI secret with its holder recorded.

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
