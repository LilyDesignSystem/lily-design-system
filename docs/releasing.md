# Releasing Lily Design System™

How versions, tags, changelogs, and the publish pipelines work. The
spec context is [spec/tooling/](../spec/tooling/index.md); the scripts
are [`bin/publish-headless`](../bin/publish-headless) and
[`bin/publish-helpers`](../bin/publish-helpers).

Who may decide a release is ready and run this procedure — including an
agentic Claude Code session, per [GOVERNANCE.md](../GOVERNANCE.md) § AI
agent publish authority — is a separate question from what the procedure
is. This document is the procedure; it applies the same way regardless of
who executes it, and the readiness criteria that section sets are exactly
the steps below actually having been done, not a separate bar.

## Version lines

There is no lockstep version. Each published package owns its line, and
the monorepo has its own (spec §14, currently 0.6.0, tagged `vX.Y.Z`).

| Line | Packages | Current |
| --- | --- | --- |
| Monorepo | the canonical catalog + docs, tagged on this repo | 0.6.0 |
| svelte/react/vue headless | npm | 0.3.1 |
| html/angular/nunjucks headless | npm | 0.1.0 |
| Blazor headless | NuGet (`LilyDesignSystem.Blazor.Headless`) | 0.1.1, published 2026-09-02 |
| The 35 pre-existing helper packages | npm / NuGet, one line each | 0.1.0, all published (the 5 Blazor ones landed on NuGet 2026-09-02) |
| The 7 `motion-picker` packages (one per catalog, added 2026-09-03) | npm / NuGet | 0.1.0, **not yet published** |

**First releases are numbered 0.1.0**, whatever version number the tree
carried internally. A first release numbered higher implies registry
history that never existed. This is settled precedent: the helpers
recorded it at their July 2026 rename reset, and html/angular/nunjucks
headless followed it at their first publish (2026-08-26) even though
their manifests had read 0.2.0/0.1.0 in-tree for months.

## Semver, pre-1.0

Everything is `0.x`: minor versions may break. Two contracts are treated
as breaking whenever they move, and drive the minor bump:

1. **The kebab-case class hooks**, including inner sub-classes
   (`breadcrumb-list-item`). Consumer CSS depends on them.
2. **Each component's keyboard and ARIA contract**, as documented in
   `components/{slug}/AGENTS.md`.

Metadata-only corrections are patch releases with a changelog entry that
says so — 0.3.1 (license expression, repository URLs, description
wording) is the worked example.

## Changelogs

- The root [CHANGELOG.md](../CHANGELOG.md) is the canonical record for
  everything, written to explain reasoning, not just list changes.
- A subproject with its own release line keeps its own
  `CHANGELOG.md`; subprojects without one carry a generated stub
  pointing at the root (see
  [spec/special-files-for-public-repos/](../spec/special-files-for-public-repos/index.md)).
- Helper CHANGELOGs preserve pre-rename history under a provenance
  heading rather than deleting it.

## Two ways to consume, one source

- **Package consumption**: npm / NuGet, via the version lines above.
- **Source consumption**: every subproject is a `git subtree` pushed to
  its own public repository (`bin/git-subtree-push`), and the zero-install
  path — copying markup — needs no artifact at all.

Registries get releases; the subtree repos track `main`. A consumer who
needs reproducibility should use packages (whose lockfile-tested
dependency graphs ship with them — lockfiles are always committed,
spec/tooling) or pin a commit.

## Release procedure (monorepo)

1. Land the work; `bin/test` and `bin/check-links` green; CHANGELOG
   section written with the reasoning.
2. Bump spec §14's version and date in the same commit.
3. Annotated tag on that commit: `git tag -a vX.Y.Z <sha> -m "<one-line>"`,
   then `git push origin vX.Y.Z` (origin fans out to GitHub, GitLab,
   and Codeberg).
4. GitHub Release from the CHANGELOG section:
   `gh release create vX.Y.Z --title "X.Y.Z — <name>" --notes-file <notes> --verify-tag`.
5. `bin/git-subtree-push` so the standalone repos carry the release
   state.

Retroactive tags v0.2.0–v0.6.0 were created 2026-08-26 against the
identified release commits; earlier history has no tags.

## Release procedure (packages)

1. Bump the package's `package.json` / `.csproj` version and write its
   CHANGELOG entry. The scripts never edit versions.
2. **Dry-run first, always**: `bin/publish-headless --dry-run` /
   `bin/publish-helpers --dry-run`.
3. **Consumer smoke**: `bin/smoke-packages` — packs every npm headless
   library and imports it from a scratch project the way a consumer
   would. This is the gate that would have caught 0.2.0; it also runs
   in CI. Never publish a package whose packed tarball you have not
   imported.
4. Publish: the scripts directly (npm login; NuGet via
   [Trusted Publishing](../spec/trusted-publishing/index.md), which
   only works inside the `publish` workflow's OIDC context — there is
   no local `NUGET_API_KEY` any more), or the tag-gated
   [`publish` workflow](../.github/workflows/publish.yml) — dry-run by
   default, real publishing only via an explicit manual dispatch, npm
   provenance enabled.

## Deprecation policy

A broken published version is **deprecated, never unpublished**: the
registry record stays, and the deprecation message names the defect and
the fixed version. Worked example — the three 0.2.0 headless packages
declared a `main` that was never built; each now carries:

> 0.2.0 is unusable: it declared a main entry (index.js) that was never
> built, so every import fails to resolve. Upgrade to >=0.3.0 …

Deprecations, like releases, get a CHANGELOG entry.

## Credentials

| Registry | Credential | Where |
| --- | --- | --- |
| npm | maintainer login / `NPM_TOKEN` secret | local `npm login`; CI secret for the workflow |
| NuGet | OIDC [Trusted Publishing](../spec/trusted-publishing/index.md) — a `NUGET_USER` secret (nuget.org profile name) plus a nuget.org policy bound to this repo's `publish.yml`; no API key exists | the `NuGet/login@v1` step in [`publish.yml`](../.github/workflows/publish.yml); see [MAINTAINERS.md](../MAINTAINERS.md) for holder + recovery |

`NPM_TOKEN` is the remaining interim posture. The standing position
([spec/trusted-publishing/](../spec/trusted-publishing/index.md)) is to
replace it with OIDC Trusted Publishing once npm's fan-out gap closes —
Codeberg has no supported OIDC provider yet. NuGet already made this
switch (2026-09): GitLab and Codeberg were never able to publish to
NuGet in the first place, so adopting Trusted Publishing for GitHub
alone didn't demote either of them from anything they could do before.
npm `--provenance` already runs today regardless, and composes with,
rather than substitutes for, Trusted Publishing.

---

Lily™ and Lily Design System™ are trademarks.
