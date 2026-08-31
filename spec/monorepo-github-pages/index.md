# Monorepo GitHub Pages

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** The public docs site ([lilydesignsystem.github.io](https://lilydesignsystem.github.io/))
is maintained as a normal nested subproject inside this monorepo
(`lilydesignsystem.github.io/`) and published by exporting that
subdirectory's history — via `git subtree` — into a standalone sibling
repository that GitHub Pages actually serves from. The sibling is a
read-only export: it is never edited directly, only ever re-derived from
the monorepo.

## Scope

This topic covers why the docs site needs a *standalone* repository at
all (GitHub Pages user/org sites must be served from a repo named exactly
`{org}.github.io`), how that standalone repo is derived from the monorepo
without duplicating maintenance effort, and the one rule that keeps the
two from drifting apart: work happens in the monorepo, never in the
export.

It does **not** cover the docs site's own content, routes, or build
(see the site's own `AGENTS.md`/`index.md` at
[lilydesignsystem.github.io/](../../lilydesignsystem.github.io/)), the
general subtree-publishing model shared by all 21+ implementation
subprojects (see [architecture](../architecture/index.md)), or the
`bin/git-subtree-push` mechanics generic to every subproject (see
[tooling](../tooling/index.md)).

## Principles and rules

- **One source, two repos, one direction.** `lilydesignsystem.github.io/`
  inside this monorepo is the single source of truth — edited, reviewed,
  and committed exactly like any other subproject. The standalone
  `lilydesignsystem.github.io` repository is a derived artifact, produced
  by `git subtree push`, never edited directly. Changes flow one way:
  monorepo → export. A commit made directly against the export repo would
  be invisible to the monorepo and get silently overwritten by the next
  `git subtree push`.
- **The repo name is not a free choice.** GitHub Pages user/organization
  sites must be served from a repository named exactly
  `{account}.github.io` — here, the `LilyDesignSystem` GitHub
  organization, so the repo must be named `lilydesignsystem.github.io`.
  This is why the nested subproject and its exported sibling share that
  exact name rather than following the `lily-design-system-*` prefix the
  other implementation subprojects use — it's a GitHub platform
  requirement, not a naming inconsistency.
- **The export is also a local sibling directory, not just a remote.**
  Alongside the monorepo checkout at `~/git/lilydesignsystem/lily-design-system/`
  sits a plain clone of the standalone remote at
  `~/git/lilydesignsystem/lilydesignsystem.github.io/` — a peer directory,
  not nested inside the monorepo. It exists so the published, subtree-split
  history can be inspected or the built site previewed independently of
  the monorepo working tree, and its own README/AGENTS files (inherited
  from the subtree export) still describe it as a subproject of the
  canonical monorepo, pointing back there for all real work.
- **Publishing is `bin/git-subtree-push lilydesignsystem.github.io`.**
  Same mechanism, same `.git-subtree-push` file convention, same
  three-forge fan-out (GitHub, Codeberg, GitLab) as every other
  subproject — see [architecture](../architecture/index.md) and
  [tooling](../tooling/index.md). No pages-specific tooling exists or is
  needed beyond that one invocation, plus GitHub Pages' own
  `deploy.yml` workflow (which lives inside the subtree and only takes
  effect once it reaches the standalone repo's root, since GitHub Actions
  reads `.github/workflows/` relative to the repository root it runs in).
- **Refreshing the local sibling is a plain `git pull`.** Because it's an
  ordinary clone of the standalone remote, keeping it current after a
  push is just `git -C ~/git/lilydesignsystem/lilydesignsystem.github.io pull`.
  It is never the target of a `git push` from anywhere except the
  monorepo's own `bin/git-subtree-push`.

## Detail sections

### Path map

| What | Where |
| --- | --- |
| Monorepo (source of truth) | `~/git/lilydesignsystem/lily-design-system/` |
| Docs site subproject (edit here) | `~/git/lilydesignsystem/lily-design-system/lilydesignsystem.github.io/` |
| Standalone export (read-only, derived) | `~/git/lilydesignsystem/lilydesignsystem.github.io/` — a **sibling** of the monorepo, not nested inside it |
| Standalone remote | `git@{github,codeberg,gitlab}.com:LilyDesignSystem/lilydesignsystem.github.io.git` |
| Live site | <https://lilydesignsystem.github.io/> |

### Publish flow

1. Edit `lilydesignsystem.github.io/` inside the monorepo as usual; commit
   there.
2. `bin/git-subtree-push lilydesignsystem.github.io` — splits that
   subdirectory's history and pushes it to all three standalone remotes.
3. The standalone repo's own `deploy.yml` (installed at its root once the
   subtree lands there) builds and deploys to GitHub Pages.
4. Optionally, `git -C ~/git/lilydesignsystem/lilydesignsystem.github.io pull`
   to refresh the local sibling clone to match.

### Why this is worth a dedicated topic

Every other implementation subproject's exported name follows the
`lily-design-system-*` prefix and exists purely as a publishing target —
nobody needs a local sibling clone of `lily-design-system-svelte-headless`
next to the monorepo, because there's no platform requirement forcing a
specific standalone name or location. The docs site is the one subproject
where the export's name and (optionally) its local presence as a sibling
directory are dictated by GitHub Pages itself, which is exactly the kind
of platform-imposed exception worth writing down rather than
rediscovering by surprise.

## Acceptance criteria

- [x] `lilydesignsystem.github.io/.git-subtree-push` exists and names the
      matching remote.
- [x] The standalone remote exists on all three forges (GitHub, Codeberg,
      GitLab) and reflects the monorepo's current subtree content —
      verified 2026-08-31 via `bin/git-subtree-push lilydesignsystem.github.io`
      (pushed cleanly to all three).
- [x] A local sibling clone exists at
      `~/git/lilydesignsystem/lilydesignsystem.github.io`, verified to
      carry the correct subtree-split history (commit messages match the
      monorepo's for that subdirectory; hashes are rewritten, as expected
      for a subtree split).
- [x] This topic is linked from [spec/index.md](../index.md)'s topic
      table.

## Related topics

- [architecture](../architecture/index.md) — the git-subtree publishing
  model and multi-forge fan-out every subproject uses.
- [tooling](../tooling/index.md) — `bin/git-subtree-push` mechanics.
- [special-files-for-public-repos](../special-files-for-public-repos/index.md) —
  the special files `bin/sync-special-files` maintains inside the docs
  site subproject, same as every other public subtree repo.

## Sources

- [lilydesignsystem.github.io/.git-subtree-push](../../lilydesignsystem.github.io/.git-subtree-push)
- [bin/git-subtree-push](../../bin/git-subtree-push)

---

Lily™ and Lily Design System™ are trademarks.
