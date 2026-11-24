# Android Kotlin: Lily for Android

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** On Android Lily can build Kotlin libraries of Jetpack Compose components that carry Lily's names,
semantics contracts, worldwide rules and domain logic. Compose fits Lily's headless idea better than SwiftUI does:
`compose.foundation` is an unstyled layer, so Lily's components can depend on it alone and leave Material 3 as an
optional adapter. The rest of the advice matches the Apple topic: wrap native controls, cover a mobile subset of the
catalog, share logic through test vectors. Unlike Swift, Maven Central has no repository-layout constraint, so the
packages can publish straight from the monorepo. This topic is research and advice (2026-11-22); nothing is built.
Tasks: [Phase 43](../../tasks.md#phase-43--mobile-foundations-2026-11-22) (shared with Apple) and
[Phase 45](../../tasks.md#phase-45--android-kotlin-2026-11-22).

## Scope

Covers: what Lily could ship for Android phone, tablet, foldable and desktop-windowed apps written in Kotlin with
Jetpack Compose; how Lily's rules translate; packaging, testing, versions and the order of work; where Kotlin
Multiplatform and Compose Multiplatform fit.

Does not cover: Android Views (XML layouts), Wear OS, Android TV and Android Auto (later candidates); iOS (see
[apple-swift](../apple-swift/index.md)); React Native, Flutter and web views.

## The platform in November 2026

- **Jetpack Compose** is Android's recommended UI toolkit. The November 2026 release made **Compose Material 3 1.5.0**
  stable, with almost every Material 3 Expressive component graduated, experimental annotations down from 120 to 58, and
  **Compose Material 2 deprecated**. Google I/O 2026 announced `Grid` and `FlexBox` layout primitives and an
  experimental `MediaQuery` API for window size and pointer precision.
- **Foundation vs Material.** `androidx.compose.foundation` gives unstyled building blocks: `BasicText`,
  `BasicTextField`, `Modifier.clickable`, `toggleable`, `selectable`, `triStateToggleable`, focus and key handling,
  lazy lists. Ready-made controls (`Switch`, `Checkbox`, `DatePicker`, `ModalBottomSheet`, `NavigationBar`) live in
  Material 3 and come styled.
- **Semantics.** Compose's semantics tree is what TalkBack, Switch Access, Voice Access and tests read:
  `Modifier.semantics { role; contentDescription; stateDescription; heading(); liveRegion; paneTitle; error(...);
selected; toggleableState; traversalIndex; isTraversalGroup; customActions; collectionInfo }`, plus
  `mergeDescendants` and `clearAndSetSemantics`. It maps closely to ARIA, including an `error` property for
  `aria-invalid`.
- **Accessibility testing.** Since Compose 1.8, `ui-test-junit4-accessibility` runs the Accessibility Test Framework
  (ATF) from a Compose test: `enableAccessibilityChecks()` on the rule, or on `runComposeUiTest` with a custom
  `AccessibilityValidator`. It needs API 34 or higher and does not run under Robolectric. Android Studio's Compose UI
  Check audits previews.
- **Android 17 (API 37)** removes the opt-out from orientation and resizability limits on large screens (sw600dp and
  up) for apps targeting it. Every Lily component must work at any window size; `DeviceConfigurationOverride` simulates
  sizes and font scales in tests. Google Play has an "Optimized for large screens" badge.
- **Kotlin 2.4** is current (2.3.0 shipped December 2025). **Compose Multiplatform** for iOS has been stable since 1.8.0
  (May 2025); 1.11.0 (May 2026) added opt-in native text input on iOS.
- **Distribution.** Maven Central through the Central Portal (OSSRH was retired in June 2025). A namespace must be
  verified: `io.github.{org}` through GitHub, or a domain the project owns. Artifacts must be signed.
- **Regulation.** As on Apple: the European Accessibility Act and EN 301 549 clause 11 apply to Android apps.

## What carries over, and what does not

| Lily rule (web)                                   | On Android with Compose                                                                                                                                                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic element first; ARIA second               | Foundation modifier with the right semantics first (`toggleable(role = Role.Switch)`, `selectable(role = Role.RadioButton)`, `BasicTextField`), `Modifier.semantics` only where it falls short.                                         |
| Kebab-case base class                             | A `{Name}Colors` / `{Name}Style` parameter object with a `{Name}Defaults` factory, and slot lambdas for content (Compose's own convention). The `Modifier` parameter is always first optional and always applied to the root.           |
| Headless: zero CSS                                | `lily-compose` depends on `compose.foundation` and `compose.ui` only. Its defaults read `LocalContentColor` and `LocalTextStyle`, so a component inherits whatever design system surrounds it; Lily tokens come from a separate module. |
| Rest props                                        | `modifier: Modifier = Modifier` on every component, applied to the root before Lily's own modifiers, so the consumer can add semantics, `testTag`, padding or focus.                                                                    |
| No hardcoded strings                              | Every label is a `String` parameter or a `@Composable` slot. No `stringResource` defaults inside Lily. Label packs are opt-in.                                                                                                          |
| `aria-live`                                       | `liveRegion = LiveRegionMode.Polite` (or `Assertive` only where the web uses assertive).                                                                                                                                                |
| `aria-expanded`, `aria-current`, `aria-pressed`   | `stateDescription` with consumer words plus `expand()` / `collapse()` semantics actions; `selected`; `toggleableState`.                                                                                                                 |
| `aria-invalid` + `aria-errormessage`              | `error("consumer message")` semantics; the message is also visible text.                                                                                                                                                                |
| `aria-describedby` hints                          | Merge the hint into the field's semantics (`mergeDescendants`) or `contentDescription` additions; never a second focus stop for the hint.                                                                                               |
| Headings and landmarks                            | `heading()` for headings; `paneTitle` for screens and sheets; `isTraversalGroup` and `traversalIndex` for reading order. No landmarks.                                                                                                  |
| Keyboard contracts (APG)                          | Hardware keyboards on tablets, Chromebooks and Android desktop windowing: `focusable`, `FocusRequester`, `onPreviewKeyEvent`, `focusProperties`; the per-component contracts apply.                                                     |
| Text does not shrink; reflow                      | Font scale up to 200% (non-linear since Android 14): text in `sp`, layouts that wrap or switch axis, never a fixed height on text. 320dp width as the narrow case.                                                                      |
| Target size                                       | 48 by 48 dp (Android's guidance). Foundation has no minimum; Lily components apply one themselves, documented.                                                                                                                          |
| Reduced motion, contrast                          | The system animator scale ("Remove animations"), high-contrast text, dark theme; read from the platform, never a Lily setting.                                                                                                          |
| Visible label in the name                         | Voice Access matches visible text; `contentDescription` must start with it.                                                                                                                                                             |
| RTL                                               | `LocalLayoutDirection`; `start`/`end` padding; `autoMirror` on directional icons.                                                                                                                                                       |
| Identifier inputs: no autocomplete, no spellcheck | `KeyboardOptions(autoCorrectEnabled = false, capitalization = KeyboardCapitalization.None, keyboardType = ...)` and no autofill `ContentType` unless the field is one.                                                                  |

Does not carry over: elements and the suffix table, the CSS template, landmark and skip-link components, page layout
shells, HTML tables on phones.

## Advice: what Lily should build

Steps 1 to 5 are Phase 43, shared with Apple; see the [Apple topic](../apple-swift/index.md#advice-what-lily-should-build)
for the full reasoning. In short: a semantics map (`mobile/semantics.tsv`), a per-component mobile decision
(`mobile/components-mobile.tsv`, `native` / `lily` / `pattern` / `none` per platform), test vectors for the shared
modules (`shared/vectors/`), identifier validation written in `shared/` (it exists in no catalog yet; P43-T4), tokens generated for each platform, and label
packs shipped as resources. On Android:

1. **Tokens to Kotlin.** `bin/generate-theme-tokens` writes a `LilyTokens` object per theme: colours as light, dark and
   high-contrast `Color` sets, dimensions from `rem` to `dp` (1rem = 16dp) and text sizes to `sp`, type roles as
   `TextStyle`s (P43-T5).
2. **Label packs.** Ship `shared/label-packs/*.json` as resources with a `LabelPack` loader; optionally generate
   `strings.xml` per locale for apps that want Android resources (P43-T6). Time zone names come from the platform
   (`android.icu.text.TimeZoneNames`, CLDR via ICU).
3. **The libraries** (P45-T1 to P45-T4): one Gradle build, `lily-design-system-kotlin`, publishing several artifacts:
   - `lily-core`: a **Kotlin Multiplatform** library (`commonMain`, no Android dependency): the ported shared modules,
     identifier validation and formatting, clinical formatting, label-pack loading. Multiplatform costs little here and
     lets Compose Multiplatform, server and desktop Kotlin use it.
   - `lily-compose`: Compose components on `foundation` and `ui` only; depends on `lily-core`. Written to compile in
     `commonMain` where foundation allows, so Compose Multiplatform users get it for free; Android-only code (for
     example a system settings intent) stays in `androidMain`.
   - `lily-compose-identifiers`: the 188 identifier components, separate as on the web.
   - `lily-compose-themes`: generated tokens and `LilyTheme { }`, a `CompositionLocalProvider` that sets them.
   - `lily-compose-material3`: an optional adapter: `LilyMaterialTheme` maps Lily tokens to a Material 3
     `ColorScheme`, `Typography` and `Shapes`, so the `native` controls (Material's `Switch`, `DatePicker`, sheets) wear
     the same theme. Material 3 1.5 or later.
     Requirements: Kotlin 2.4, explicit API mode (`explicitApi()`), binary-compatibility validation, `minSdk` 24 (Compose 1.13's floor; an app's manifest merge refuses 23), `compileSdk` and `targetSdk` 37, no runtime dependency beyond
     AndroidX and kotlinx.
4. **Publishing from the monorepo.** Maven Central does not care where the source lives, so the Gradle build publishes
   from its subproject directory, from the maintainer's machine, like the npm packages
   (`bin/publish-kotlin`). Group `com.lilydesignsystem` (verified by a DNS TXT record on the project's domain, chosen 2026-11-24 over
   `io.github.lilydesignsystem`; the Kotlin packages keep their `io.github` names); POMs name the monorepo with the subproject path, enforced by `bin/check-package-metadata`.
5. **Example app** (P45-T5). `lily-design-system-android-examples`: home, a searchable component list and a detail screen
   per component with demo, code and variants; composed screens matching the Apple app. Adaptive from the start
   (list-detail on wide windows), since Android 17 removes the opt-out.
6. **Helpers.** As on Apple: `text-size-picker` and `motion-picker` **declined** (system font scale and animator scale);
   `locale-picker` becomes a thin helper over per-app language (`LocaleManager` / `AppCompatDelegate.setApplicationLocales`,
   Android 13 and later), not a Lily list; `share-picker` is the Android Sharesheet; `search-picker` and
   `date-time-picker` are `native` (Material 3 `SearchBar`, `DatePicker`); `theme-picker` (brand themes, persisted with
   DataStore) and `time-zone-picker` are kept. Unlike iOS, Compose has **no colour picker**, so `color-picker` is a
   real Lily candidate on Android. The grid-like helpers are deferred, `filter` first.
7. **Skill and docs** (P45-T7). `lily-design-system-kotlin-skill`; a Kotlin tab on the docs site's component pages.

## Compose Multiplatform: a bonus, not the Apple offering

Compose Multiplatform could render the same Kotlin components on iOS, and Lily should keep `lily-core` and as much of
`lily-compose` as possible in `commonMain` so that works. But it is not how Lily should serve Swift teams: they want
SwiftUI types, SwiftUI styles and native VoiceOver behaviour, not a Kotlin/Native framework drawing its own controls.
So: Compose Multiplatform support is a tested side effect (one CMP iOS screen run under VoiceOver, P45-T8), and the
Swift package is the Apple product.

## Not adopted

- **An Android Views (XML) catalog.** Compose is the platform's direction; Views apps host Lily through `ComposeView`,
  which Lily documents and tests once.
- **Depending on Material 3 in the core library.** It would force Material's look and its release cadence on apps with
  their own design system; it stays in the adapter.
- **Re-implementing Material controls on foundation** (a Lily switch, date picker, bottom sheet). `native` means the
  platform's; on Compose that is Material 3.
- **All 661 components**, a Lily look, bundled fonts, overriding font scale, motion or language.
- **Swift on Android for shared logic.** The Swift 6.3 Android SDK is real, but it would put the Swift runtime and a JNI
  layer into every Android app. Test vectors keep the ports honest instead.

## Naming

- Composables keep the catalog's PascalCase (`ObservationView`, `IbanInput`); the catalog already writes acronyms as
  words, which is also Kotlin's convention. A `lily` composable whose name clashes with a type apps commonly import gets a
  `Lily` prefix: `LilyCard` and `LilyBadge` (Material 3), `LilyNotification` (`android.app.Notification`); recorded in
  `mobile/components-mobile.tsv`.
- Where the catalog name is also a Material 3 or foundation composable (`Button`, `Checkbox`, `Switch`, `Slider`,
  `Text`, `Image`) and the platform control does the job, Lily ships no composable of that name; the decision is `native`, with tokens via
  the Material adapter.
- Package names: `io.github.lilydesignsystem.core`, `.compose`, `.compose.identifiers`, `.compose.themes`,
  `.compose.material3`.

## Testing

- **Unit**: `kotlin.test` in `lily-core` on the JVM (and the other multiplatform targets), reading every shared vector
  file.
- **Semantics**: Compose UI tests under Robolectric on the JVM, fast and in `bin/ci`: assert role, content description,
  state description, `error`, heading and traversal order with `SemanticsMatcher`, one test per contract clause.
- **ATF**: the same tests with `enableAccessibilityChecks()` on an API 34+ emulator, in a slower `bin/ci` job; ignored
  findings listed with reasons (the list may only shrink).
- **Sizes**: every example screen at 320dp wide, at font scale 1.0, 1.5 and 2.0, and on a large-screen window, through
  `DeviceConfigurationOverride`, asserting no clipped text and no lost controls.
- **Screenshots**: optional, for the themed styles (Compose Preview Screenshot Testing).
- **Assistive technology**: TalkBack, Switch Access, Voice Access and a hardware keyboard, recorded in
  `docs/screen-reader-matrix.md`.
- **CI**: Gradle and an Android SDK run on Linux or macOS; the emulator job needs hardware acceleration, so run it
  locally first ([local-ci](../local-ci/index.md)).

## Acceptance criteria

- [ ] Phase 43's shared criteria (semantics map, mobile decisions, vectors, tokens, label packs) are met for Android.
- [ ] `lily-design-system-kotlin` builds `lily-core` (multiplatform), `lily-compose`, `lily-compose-identifiers`,
      `lily-compose-themes` and `lily-compose-material3`, with explicit API mode and binary-compatibility checks.
- [ ] `lily-compose` has no dependency on any Material library.
- [ ] No Lily composable has a hardcoded user-facing string or a `stringResource` default.
- [ ] Every shipped composable has its semantics and keyboard contract in its `AGENTS.md` under an "Android" heading,
      a Robolectric test per clause and an ATF pass.
- [ ] The example app works at 320dp, font scale 2.0 and in a resizable large-screen window.
- [ ] A release resolves from Maven Central in a fresh Android Studio project.

## Related topics

- [apple-swift](../apple-swift/index.md) — the Apple counterpart and the full reasoning for Phase 43.
- [accessibility](../accessibility/index.md), [headless](../headless/index.md), [internationalization](../internationalization/index.md).
- [theme](../theme/index.md), [label-packs](../label-packs/index.md), [zone-names](../zone-names/index.md).
- [national-identifiers](../national-identifiers/index.md), [healthcare-ui](../healthcare-ui/index.md).
- [trusted-publishing](../trusted-publishing/index.md), [local-ci](../local-ci/index.md), [frameworks](../frameworks/index.md).

## Sources

- Android Developers, [Jetpack Compose November 2026 release](https://developer.android.com/blog/posts/jetpack-compose-november-2026-release),
  [Compose Material 3 releases](https://developer.android.com/jetpack/androidx/releases/compose-material3),
  [Compose roadmap](https://developer.android.com/jetpack/androidx/compose-roadmap).
- Android Developers, [Accessibility testing in Compose](https://developer.android.com/develop/ui/compose/accessibility/testing) and
  [ui-test-junit4-accessibility reference](https://developer.android.com/reference/kotlin/androidx/compose/ui/test/junit4/accessibility/package-summary).
- Android Developers, [Prepare for the resizability and orientation changes in Android 17](https://developer.android.com/blog/posts/prepare-your-app-for-the-resizability-and-orientation-changes-in-android-17) and
  [Adaptive development for the expanding Android ecosystem](https://developer.android.com/blog/posts/adaptive-development-for-the-expanding-android-ecosystem).
- JetBrains, [Compose Multiplatform 1.8.0: iOS is stable](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/),
  [What's new in Compose Multiplatform 1.11](https://kotlinlang.org/docs/multiplatform/whats-new-compose-111.html),
  [What's new in Kotlin 2.4](https://kotlinlang.org/docs/whatsnew24.html).
- Swift.org, [Swift 6.3 released](https://swift.org/blog/swift-6.3-released/) (the Swift SDK for Android).
- Repo: [components.tsv](../../components.tsv), [shared/](../../shared/), [themes/tokens/](../../themes/tokens/).

---

Lily™ and Lily Design System™ are trademarks.
