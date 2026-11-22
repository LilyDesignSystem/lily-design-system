# Lily Design System: Swift — AI coding help

Read [spec/apple-swift](../spec/apple-swift/index.md) first, then [mobile/semantics.tsv](../mobile/semantics.tsv) (ARIA to
SwiftUI) and [mobile/components-mobile.tsv](../mobile/components-mobile.tsv) (what each component is on Apple platforms).

- One SwiftPM package, `LilyDesignSystem`, products `LilyCore` (pure Swift) and `LilyUI` (SwiftUI). Swift 6 language mode,
  strict concurrency, iOS 18+, macOS 15+ for tests.
- A component is a `View` whose look is a style protocol: `{Name}Style` with `makeBody(configuration:)`, a
  `{Name}StyleConfiguration`, a `Plain{Name}Style` exposed as `.plain`, an environment value and a `.{name}Style(_:)` modifier.
  The component applies its accessibility modifiers to the style's output, never inside it.
- Accessibility decisions that can be computed (hints, spoken text, announcement priority) live in `LilySemantics` as pure
  functions with a Swift Testing test each.
- No default user-facing text. Parameters are `String`, shown with `Text(verbatim:)`. Spoken joins use `LilySemantics.spoken`.
- Only build a component whose Apple decision is `lily`; for `native`, document the platform control instead.
- Name a type with the catalog's PascalCase; use the `Lily` prefix only where the TSV gives one (a platform clash).
- `LilyCore` ports `shared/` modules: add the vector cases to `shared/vectors/` first, run `pnpm test` in `shared/`, sync with
  `bin/sync-shared-modules`, then port until `swift test` passes.

Verify: `swift test`, the iOS Simulator `xcodebuild` build, and `bin/test` from the monorepo root.
