# AGENTS — Lily Design System™ Nunjucks headless identifiers

Read [spec/index.md](spec/index.md), then [AGENTS/](AGENTS/) (copied from the repository root by `bin/sync`).

- The 164 national identifier components (category `national` in `components-categories.tsv`), with their tests, in the
  same layout as `lily-design-system-nunjucks-headless`, whose conventions apply unchanged. The rules are in
  `AGENTS/national-personal-identifier-normalization.md`.
- Helper modules the components import are copies kept by `bin/sync-shared-modules` (or copied from the headless
  package); edit the source, never the copy.
- Verify: the package's tests and build, and `bin/test` from the repository root.

---

Lily™ and Lily Design System™ are trademarks.
