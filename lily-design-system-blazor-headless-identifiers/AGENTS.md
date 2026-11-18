# AGENTS — Lily Design System™ Blazor headless identifiers

Read [spec/index.md](spec/index.md), then [AGENTS/](AGENTS/) (copied from the repository root by `bin/sync`).

- The 188 national identifier components (category `national` in `components-categories.tsv`), with their tests, in the
  same layout as `lily-design-system-blazor-headless`, whose conventions apply unchanged. The rules are in
  `AGENTS/national-personal-identifier-normalization.md`.
- The components keep the `LilyBlazorHeadless.Components` namespace and extend the headless library's `ValueInputBase`
  through a project reference (a NuGet dependency once packed).
- Verify: the package's tests and build, and `bin/test` from the repository root.

---

Lily™ and Lily Design System™ are trademarks.
