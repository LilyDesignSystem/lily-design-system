# Proposal: copy one component into a project (`lily add`)

Status: **proposed 2026-10-11, awaiting a maintainer decision** (tasks.md P10-T6). Nothing below is built.

## The problem

Lily already leads with copying: the website says to copy a component's markup, with no dependency and no build. RFC 8
names what that costs. A copy never receives a fix: an accessibility defect found next year never reaches anyone who
copied this year, which for a project whose whole argument is accessibility may be self-defeating. Lily has no tooling
around copying at all.

bref-ui (surveyed 2026-10-11, plan.md) has the shadcn-style answer. A `registry.json` beside each component lists its
files, exports and dependencies. One loader validates the ids, that the files exist, and that the dependency graph has
no cycles. Then `add <component>` copies a component and its dependencies, previews each file as `add`, `unchanged` or
`conflict`, and asks before every overwrite.

## What Lily would add

A copy is only useful if it can learn about later fixes, so the proposal is that, plus the copying.

1. **`lily add <slug>`** copies one component, and anything it imports, from a Lily package the project has already
   installed (for example `@lilydesignsystem/svelte-headless` as a dev dependency) into the project, by default
   `src/lib/lily/`. No hosted registry and no network: the published package is the source. It previews
   `add` / `unchanged` / `conflict` for every file, asks before each overwrite, and supports `--dry-run`.
2. **A `lily.json` lockfile** in the project records each copied component: package, version, and a hash of each file
   as it was copied.
3. **`lily outdated`** lists copied components whose upstream files changed in a newer installed version. **`lily diff
   <slug>`** shows that upstream change, so the team applies it to its own edited copy by hand. This is the part that
   answers RFC 8. It is deliberately not an automatic merge, because the copy is now the team's code.

## How it fits the repository

- **Manifests are generated, not hand-written.** Each package's build writes a `registry.json` from the components'
  own imports. Most components have no dependencies: in Svelte, React and Vue only 2 of 571 import a sibling
  (`Scroller` and `ScrollerVideo` import `ScrollerBase`), and Angular has none. All 536 Web Components components
  import one shared internal module, `dom-utils`, which would be copied once.
- **`bin/test` validates every manifest**, as bref-ui's loader does: unique ids, every file present, no cycles.
- **One Node script** (Lily requires Node 26) published as its own package (`@lilydesignsystem/cli` or similar). bref-ui
  needs Bun; Lily would not.

## Suggested scope

- **Phase 1: Svelte headless only**, the canonical library. It needs `add`, `lily.json`, `outdated`, `diff`, the
  generated manifest and its `bin/test` check, plus tests that copy into a scratch Svelte project, as
  `bin/smoke-packages` does today.
- **Phase 2:** React, Vue and Angular headless, which are single files per component, and Web Components (plus
  `dom-utils`).
- **Not included:** HTML and Nunjucks (they are already copy-the-markup; `lily outdated` could still cover them later),
  Blazor (copied `.razor` files need namespace rewriting), and the helper packages (a picker depends on headless
  components from another package, which crosses package boundaries — a later question).

## Questions for the maintainer

1. Should Lily take this on at all, given RFC 8 is still open and has no evidence from people who copied?
2. Is Phase 1 (Svelte headless only) the right first step?
3. The package name, and the default destination (`src/lib/lily/`)?
4. Should `outdated` and `diff` ship with `add` in Phase 1? This proposal says yes: without them, the tooling makes the
   RFC 8 problem easier to create without making it easier to fix.

---

Lily™ and Lily Design System™ are trademarks.
