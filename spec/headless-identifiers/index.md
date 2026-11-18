# Headless identifiers packages

## Summary

The 164 national personal identifier components (82 identifier types, each an `-input` and a `-view`) move out of the
ten headless libraries into one add-on package per catalog, `lily-design-system-{framework}-headless-identifiers`.
Decided by the maintainer on 2026-11-17; tracked in [tasks.md](../../tasks.md) as Phase 37.

## Scope

- In scope: the ten catalogs that ship the identifiers today (Svelte, React, Vue, Angular, HTML, Nunjucks, Blazor, Web
  Components, Alpine, Solid); their components, tests, stories and package builds; the root checks that read them; the
  example apps that render them; the docs that count them.
- Not changed: the canonical catalog. `components.tsv`, `components-categories.tsv` (category `national`) and
  `components/{slug}/` keep all 661 rows. The docs say "473 core + 188 identifiers" (164 at the split, 188 since the 2026-11-18 round).
- Not changed: what an identifier component renders, its props, class hooks, keyboard and ARIA contract, and the rules
  in [national-identifiers](../national-identifiers/index.md).

## Decisions

1. **Removed from the headless packages, not re-exported.** Each headless package drops the identifiers in its next
   minor release (0.x, so the minor is the breaking change), with a CHANGELOG entry and a migration note: install
   `@lilydesignsystem/{framework}-headless-identifiers` and change the import. A re-export would give every headless
   package a dependency for one release, for adopters who are few and can change an import line.
2. **One package per catalog, same layout.** Each `-headless-identifiers` package keeps its catalog's file layout
   (`components/{Name}.tsx`, `components/{Name}/{Name}.svelte`, `components/{slug}.html`, …) and build, so a root check
   finds an identifier by the same path with `-headless/` replaced by `-headless-identifiers/`.
3. **Shared modules are copied, not imported across packages.** The identifier components need only `dev-warning`
   (and Solid's `attr` and `defaults`); each identifiers package carries a copy, kept in step by
   `bin/sync-shared-modules`. Neither package depends on the other, **except in Blazor**: every Blazor identifier input
   extends the headless library's `ValueInputBase`, and a copy would be a second public
   `LilyBlazorHeadless.Components.ValueInputBase` that no app could reference beside the headless package. So
   `LilyDesignSystem.Blazor.Headless.Identifiers` depends on `LilyDesignSystem.Blazor.Headless` (a project reference
   that packs as a NuGet dependency), and its components keep their namespace (decided 2026-11-18).
4. **Names.** npm `@lilydesignsystem/{framework}-headless-identifiers`; NuGet `LilyDesignSystem.Blazor.Headless.Identifiers`.
5. **Example apps keep every page.** They depend on both packages (or sync from both), so `/components/{slug}` still
   renders every identifier.

## Order of work

Each step leaves `bin/test`, CI and every example app green:

1. A root rule: the checks (`check-class-names`, `check-html-tags`, `check-coverage`, `check-identifier-inputs`,
   `check-dev-warnings`, `check-built-english`, `check-port-data-attributes`, `generate-api-docs`) resolve a `national`
   slug to the identifiers package when it exists there.
2. Per catalog: create the identifiers package with its components, tests, stories, build and required files; point the
   example app at it; remove the identifiers from the headless package; bump both versions; CHANGELOG.
3. Docs: counts, `AGENTS/lily.md`, `spec/architecture`, the per-framework skills, `bin/publish-headless`.
4. Publish (maintainer approval): the ten identifiers packages and the breaking headless releases.

## Acceptance criteria

- [x] Ten `-headless-identifiers` packages, each with the 164 components and their tests passing.
- [x] No headless package ships an identifier component.
- [x] Every root check passes, and finds each identifier in its new package.
- [x] Every example app still renders all 637 component pages.
- [x] Each headless CHANGELOG has the breaking entry and the migration note (Blazor, whose CHANGELOG points at the
      root one: in the root CHANGELOG).

## Related topics

- [national-identifiers](../national-identifiers/index.md) — the components themselves.
- [architecture](../architecture/index.md) — the subproject list.
- [headless](../headless/index.md) — the headless rules, unchanged.

---

Lily™ and Lily Design System™ are trademarks.
