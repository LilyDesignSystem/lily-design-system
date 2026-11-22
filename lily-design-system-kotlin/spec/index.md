# Lily Design System: Kotlin — specification

The topic spec is [spec/android-kotlin](../../spec/android-kotlin/index.md); this file tracks this build's own acceptance
criteria. Tasks: [tasks.md Phase 45](../../tasks.md#phase-45--android-kotlin-2026-11-22).

## Acceptance criteria

- [x] One Gradle build with `lily-core` (multiplatform) and `lily-compose`, Kotlin 2.4, explicit API mode, `minSdk` 24 (Compose 1.13's floor, found 2026-11-22 when the example app merged manifests; 23 was wrong) (P45-T1).
- [x] `lily-compose` has no Material dependency, enforced by `checkNoMaterial`, which was seen to fail when Material 3 was added.
- [x] `lily-core` ports `search-text`, `middle-truncation` and the locale-independent `clinical-format` functions and passes all
      88 cases in `shared/vectors/`; a deliberately broken port fails (P45-T2, first modules).
- [x] `lily-compose` has `Field`, `ErrorSummary`, `SummaryList`, `SummaryListItem`, `WarningText` and `LilyAlert`, with eight
      Robolectric tests of their semantics; removing the title's `heading()` fails one (P45-T3, first slice).
- [x] 100% line coverage of `lily-core` and `lily-compose`, enforced by `./gradlew koverVerify` (Kover 0.9.11), 2026-11-22.
- [ ] Binary-compatibility validation, and native targets for `lily-core`.
- [x] ATF (`enableAccessibilityChecks()`) passes on the example app's catalog and every detail view, on an API 37 emulator,
      at font scale 1.0 and 2.0 (2026-11-22). It found the catalog's search field 44dp tall; fixed.
- [ ] `lily-compose-identifiers`, `lily-compose-themes`, `lily-compose-material3`.
- [ ] An "Android" section in each shipped component's `components/{slug}/AGENTS.md`.
- [ ] Published to Maven Central (P45-T6; needs approval).

## Decisions

- **Foundation only.** Compose has an unstyled layer, so `lily-compose` is headless in the web's sense; the look comes from
  `LocalLilyTextStyles` and the caller's modifiers. Material 3 stays an optional adapter.
- **Field hands its control a Modifier.** Compose has no label-for-id link, so `Field` gives the control a `Modifier` with its
  spoken name (label, description, required word) and `error(...)`, and hides the visible copies.
- **Required needs a word.** Compose has no required semantics; `Field` speaks the app's `requiredLabel`, or nothing.
- **Live regions for alerts.** `LilyAlert` is a live region (`Assertive` by default, as `role="alert"`); `Politeness.Off` sets none.
- **JVM 17 bytecode, no toolchain pin.** The build uses whatever JDK runs Gradle and targets 17.
- **compileSdk 37.2.** Compose 1.13 (BOM 2026.11.01) requires compileSdk 37.1 or later; `minSdk` stays 23.

## Known limitations

- `ErrorSummary` moves input focus to its title; TalkBack normally follows, but an emulator run must confirm it (P45-T5).
- `lily-core` takes dates as UTC epoch milliseconds; callers convert.
- Robolectric runs at SDK 36, the newest it supports with this build.

---

Lily™ and Lily Design System™ are trademarks.
