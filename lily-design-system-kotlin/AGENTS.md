# Lily Design System: Kotlin — AI coding help

Read [spec/android-kotlin](../spec/android-kotlin/index.md) first, then [mobile/semantics.tsv](../mobile/semantics.tsv) (ARIA
to Compose) and [mobile/components-mobile.tsv](../mobile/components-mobile.tsv) (what each component is on Android).

- One Gradle build: `lily-core` (Kotlin Multiplatform, JVM target, package `io.github.lilydesignsystem.core`) and `lily-compose`
  (Android library, package `io.github.lilydesignsystem.compose`). Explicit API mode in both.
- A composable takes `modifier: Modifier = Modifier` and applies it to its root; text is `String` parameters; slots are
  composable lambdas. Semantics come from `Modifier.semantics` / `clearAndSetSemantics`, as `mobile/semantics.tsv` says.
- `lily-compose` depends on `compose.foundation` and `compose.ui` only. No Material, no string resources, no default text.
- Accessibility decisions that can be computed live in `LilySemantics`; each composable has a Robolectric test per contract
  clause that reads the semantics tree.
- Only build a component whose Android decision is `lily`; use the `Lily` prefix only where the TSV gives one.
- `lily-core` ports `shared/` modules: add vector cases to `shared/vectors/` first, run `pnpm test` in `shared/`, sync with
  `bin/sync-shared-modules`, then port until `./gradlew :lily-core:jvmTest` passes.

Verify: `./gradlew build checkNoMaterial`, and `bin/test` from the monorepo root.
