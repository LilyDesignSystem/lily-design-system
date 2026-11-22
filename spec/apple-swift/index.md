# Apple Swift: Lily for iOS and iPadOS

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Adopters have asked for Lily's semantics in their mobile apps. On Apple platforms Lily can build a Swift
package of SwiftUI components that carry Lily's names, accessibility contracts, worldwide rules and domain logic, styled
through SwiftUI's own style protocols instead of CSS. It should wrap native controls and never replace them, cover a
mobile subset of the catalog rather than all 661 rows, and share its pure logic with the web through test vectors, not
through a cross-language runtime. This topic is research and advice (2026-11-22); nothing is built. Tasks:
[Phase 43](../../tasks.md#phase-43--mobile-foundations-2026-11-22) (shared with Android) and
[Phase 44](../../tasks.md#phase-44--apple-swift-2026-11-22).

## Scope

Covers: what Lily could ship for iPhone and iPad apps written in Swift, using SwiftUI and, where needed, UIKit; how Lily's
rules translate; packaging, testing, versions and the order of work.

Does not cover: macOS, watchOS, tvOS and visionOS (a SwiftUI package reaches them cheaply later, but none is a goal);
Android (see [android-kotlin](../android-kotlin/index.md)); React Native, Flutter, Capacitor and other cross-platform
runtimes (a web view already gets the HTML catalog); Compose Multiplatform on iOS (assessed in the Android topic).

## The platform in November 2026

- **SwiftUI** is Apple's main UI framework. The 2027 OS releases (iOS 27, Xcode 27, announced at WWDC26) add a Document
  API, toolbar `visibilityPriority` and `toolbarMinimizeBehavior`, drag-to-reorder on any container, lazily initialised
  `@State` classes, and `ContentBuilder` (the former `ViewBuilder`) for faster builds. iPhone apps become resizable on
  iOS 27. SwiftUI apps pick up the updated Liquid Glass look on their own.
- **UIKit** remains the base under SwiftUI and the home of the full `UIAccessibility` API, `UITextField` input traits and
  some text behaviour SwiftUI does not expose. New Apple work and new adopters start in SwiftUI; UIKit is reached through
  `UIViewRepresentable` and `UIHostingController`.
- **Swift 6** has strict concurrency checking. Swift 6.3 (March 2026) added the first official Swift SDK for Android and a
  preview of Swift Build in SwiftPM.
- **Accessibility tooling.** XCUITest's `performAccessibilityAudit` (since Xcode 15) runs the Accessibility Inspector's
  checks in a UI test and fails on what it finds, with categories and an ignore handler. A 2026 forum thread reports false
  positives on plain SwiftUI `Text` section headers in a `Form` in Xcode 27.1, so an audit is a gate to run, not proof.
- **Distribution.** Swift Package Manager is the standard. CocoaPods' trunk becomes read-only in December 2026, so it is
  not an option. SwiftPM resolves a package from a git URL and expects `Package.swift` at the root of that repository.
- **Regulation.** The European Accessibility Act has applied to apps since June 2025, through EN 301 549 clause 11
  (software). The App Store's Accessibility Nutrition Labels let an app declare VoiceOver, Voice Control, Larger Text,
  Sufficient Contrast, Reduced Motion, captions and more. Both make a component library's mobile accessibility claims
  something adopters will be asked to show.

## What carries over, and what does not

Lily's value is not its markup; it is the contracts around the markup. Most of them carry over.

| Lily rule (web)                                                            | On Apple platforms                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Most specific semantic element first; ARIA only where semantics fall short | Most specific native control first (`Toggle`, `Picker`, `DatePicker`, `Menu`, `TextField`, `Gauge`, `ShareLink`); accessibility modifiers (`accessibilityLabel`, `accessibilityValue`, `accessibilityAddTraits`, `accessibilityRepresentation`) only where the control falls short. |
| Kebab-case base class as the styling hook                                  | A style protocol per component (`ObservationViewStyle`) set through the environment (`.observationViewStyle(.lily)`), like `ButtonStyle`. There is no class; the style type is the contract.                                                                                        |
| Headless: zero CSS                                                         | A **plain** style that draws only what the platform draws by default (system fonts, system colours, no decoration), and a separate **themed** style that reads Lily tokens. The plain style is the headless equivalent.                                                             |
| Rest props spread onto the root                                            | Modifiers compose: every component is a `View`, so the consumer adds modifiers. Never wrap in a way that blocks `.accessibility*`, `.disabled`, `.focused` or `.id`.                                                                                                                |
| No hardcoded user-facing strings                                           | Every label is a parameter of type `Text`, `LocalizedStringResource` or a `@ViewBuilder` label. No `"Close"` default. Label packs are opt-in, as on the web.                                                                                                                        |
| `aria-live` regions                                                        | `AccessibilityNotification.Announcement(...).post()` for one-off messages, `.accessibilityAddTraits(.updatesFrequently)` for changing values; same "deliberate only" rule.                                                                                                          |
| `aria-expanded`, `aria-current`, `aria-pressed`, `aria-invalid`            | `accessibilityValue` with consumer-supplied words, `.isSelected`, `.isToggle`, and an error announced and described in words (there is no invalid trait).                                                                                                                           |
| Headings and landmarks                                                     | `.isHeader` for headings (the VoiceOver rotor uses them). There are no landmarks; group with `accessibilityElement(children: .contain)` and order with `accessibilitySortPriority`.                                                                                                 |
| Keyboard contracts (APG)                                                   | Still matter: iPad with a hardware keyboard, Full Keyboard Access and Switch Control. Use `.focusable()`, `@FocusState`, `.onKeyPress`, `.keyboardShortcut`; contracts are documented per component as on the web.                                                                  |
| Focus ring contract                                                        | The system focus effect; never hide it. No Lily ring.                                                                                                                                                                                                                               |
| Text does not shrink below 1rem; reflow at 400%                            | Dynamic Type through the accessibility sizes (AX1 to AX5). Text styles, never fixed point sizes; layouts switch axis at accessibility sizes (`ViewThatFits`, `dynamicTypeSize.isAccessibilitySize`). Never cap Dynamic Type.                                                        |
| Target size (WCAG 2.5.8, themes' 44px coarse pointer)                      | 44 by 44 points (Apple's guidance), with `contentShape` to grow the hit area.                                                                                                                                                                                                       |
| `prefers-reduced-motion`, contrast, invert                                 | `accessibilityReduceMotion`, `colorSchemeContrast`, `accessibilityDifferentiateWithoutColor`, `legibilityWeight`, `accessibilityIgnoresInvertColors` on images. Read from the environment; never a Lily setting.                                                                    |
| Visible label in the name (WCAG 2.5.3)                                     | Voice Control: the accessible label starts with the visible text; `accessibilityInputLabels` for extra spoken names.                                                                                                                                                                |
| RTL inherited from `dir`                                                   | `layoutDirection` from the locale; leading/trailing, never left/right; mirrored symbols where meaning is directional.                                                                                                                                                               |
| Identifier inputs: `autocomplete="off"`, `spellcheck="false"`              | `.textContentType(nil)` or the right content type, `.autocorrectionDisabled()`, `.textInputAutocapitalization(.never)`, a fitting `keyboardType`, and no privacy-unsafe defaults.                                                                                                   |

What does **not** carry over: the suffix-to-element table (there are no elements), the CSS template, the 63 themes as
stylesheets, landmark and skip-link components, page layout shells (`grail-layout`, `container-with-*`), and HTML table
families on iPhone (SwiftUI `Table` collapses to one column in compact width).

## Advice: what Lily should build

In priority order. Each step is useful on its own.

1. **A semantics map, before any code.** One table, `mobile/semantics.tsv`, mapping each ARIA role, state and property
   Lily uses to its SwiftUI and UIKit equivalent and its Jetpack Compose equivalent, with "none" and a reason where there
   is none. It is the mobile version of the ARIA reference in [accessibility](../accessibility/index.md), and the first
   thing a reviewer or an AI agent needs. Shared with Android (P43-T1).
2. **A mobile catalog decision per component.** `mobile/components-mobile.tsv`: for every slug in `components.tsv`, the
   Apple decision and the Android decision, each one of `native` (use the platform control; Lily documents it and may
   give it a style), `lily` (Lily ships a component), `pattern` (a documented composition, no type), or `none` (web
   only), with a reason. A check keeps it in step with the catalog, as `bin/check-native-primitives` does for overlays
   (P43-T2). A first estimate from the categories in `components-categories.tsv`:
   - **188 national identifiers**: `lily`. Each `-input` / `-view` pair is the strongest mobile case: validation,
     formatting, the right keyboard, no autocorrect, no autofill leak, and a spoken form for VoiceOver (digits grouped as
     the issuing body writes them).
   - **Healthcare** (`observation-view`, `allergy-record-list`, `medication-view`, `age-view`, `duration-view`,
     `early-warning-score-view`, `decision-support-card`, `international-patient-summary`, the record lists): `lily`.
     Health apps are the adopters asking.
   - **80 forms**: mostly `native` with a Lily wrapper for the field contract (`field`, label, hint, error message,
     `error-summary` that takes focus). Lily-only inputs (`one-time-password-input` via `.textContentType(.oneTimeCode)`,
     `range-fieldset`, `iban-input`, `quantity-input-div`, the rating radio groups) are `lily`.
   - **60 navigation, 17 overlays**: `native` (`NavigationStack`, `TabView`, `.sheet`, `.alert`, `.confirmationDialog`,
     `.popover`, `Menu`). Lily never ships its own navigation stack or modal. Breadcrumbs, pagination, skip links: `none`.
   - **53 lists, 169 content**: split. `summary-list`, `description-list`, `task-list`, `check-list`, `do-list`,
     `empty-state`, `badge`, `tag`, `card`, `alert`, `banner`, `warning-text`, `inset-text`: `lily` (small, semantic,
     often requested). Editorial and scrollytelling components: `none`.
   - **39 tables**: `none` on iPhone; `data-table` as `native` (`Table`) on iPad. Mobile tables become lists.
   - **19 data-viz**: `native` on Swift Charts, which has accessibility and Audio Graphs built in; Lily supplies the
     figure-plus-data-table pattern and the chart's summary text contract.
   - Result (2026-11-22, [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv)): on Apple 343 `lily` (155
     plus the 188 identifiers), 146 `native`, 34 `pattern`, 138 `none`.
3. **Shared logic through test vectors, not a shared runtime.** The pure modules in `shared/` (search, type-ahead, edit
   history, filter model, clinical format, calendar system, middle truncation, wheel picker, zones) and the identifier
   validators are what make a Lily component correct. Port them to Swift by hand and prove them equal with JSON vectors
   exported from the TypeScript tests: `shared/vectors/{module}.json`, read by the Swift and Kotlin test suites (P43-T3).
   Lily already keeps C# twins this way in Blazor (`ClinicalFormat`). Alternatives assessed and declined:
   - _Kotlin Multiplatform core consumed from Swift_: one source, but every Swift adopter then links a Kotlin/Native
     framework and its runtime, and Swift export is still maturing. Too heavy a dependency for a design system.
   - _JavaScriptCore running the TypeScript modules_: slow start, no type safety at the boundary, and App Review friction.
   - _Swift on Android (Swift 6.3 SDK)_: real, but it would make Android adopters ship the Swift runtime and a JNI layer.
     Revisit in 2028.
     Before porting, move the identifier validators out of the per-catalog components into `shared/identifiers.ts` with
     vectors; today every catalog carries its own copy (P43-T4).
4. **Tokens to Swift.** `bin/generate-theme-tokens` already reads strict DTCG 2025.10 JSON. Add a Swift output: a
   `LilyTokens` type per theme, colours as light/dark/high-contrast pairs, dimensions converted from `rem` to points
   (1rem = 16pt, scaled with `@ScaledMetric` for spacing that should grow with Dynamic Type), and type roles mapped to
   SwiftUI text styles, never fixed sizes (P43-T5). Ship a handful of themes first (light, dark, NHS England, GOV.UK,
   USWDS, one non-Anglophone public sector theme), not all 63. The contrast gate (`bin/check-theme --contrast --gate`)
   checks the same pairs.
5. **Label packs and zone names.** Keep `shared/label-packs/*.json` as the source and ship them as package resources with a
   `LabelPack` loader, as Blazor does; optionally generate a String Catalog (`.xcstrings`) for apps that want Xcode's
   tooling (P43-T6). For time zones use Foundation (`TimeZone.localizedName(for:locale:)`, ICU-backed CLDR), not Lily's
   packs; the "names come from CLDR" rule is met by the platform.
6. **The Swift package** (P44-T1 to P44-T4). One SwiftPM package, `lily-design-system-swift`, with several products:
   - `LilyCore`: pure Swift, no UI, Linux-testable: the ported shared modules, identifier validation and formatting,
     clinical formatting, label-pack loading.
   - `LilyUI`: SwiftUI components with their style protocols and plain styles; depends on `LilyCore`.
   - `LilyIdentifiers`: the 188 identifier views, a separate product as on the web (they are most of the catalog by count
     and many apps need none).
   - `LilyThemes`: the generated tokens and the themed styles.
     Requirements: Swift 6 language mode, strict concurrency, iOS 18 and iPadOS 18 minimum (the current and two previous
     majors; confirm against adoption figures at P44-T1), no third-party runtime dependencies.
7. **Publishing from a monorepo.** SwiftPM needs `Package.swift` at a repository root, and cloning the monorepo (68,000+
   files) for one package is unacceptable. Two options:
   - **Recommended: a read-only export repository**, `lilydesignsystem/lily-design-system-swift`, pushed by
     `make publish-swift` with `git subtree`, exactly as the docs site is published today
     ([monorepo-github-pages](../monorepo-github-pages/index.md)). Releases are git tags on the export repo. This reverses
     the 2026-10-10 "no mirrors" decision for one more subproject, for a reason SwiftPM imposes; record it there.
   - _A Swift package registry (SE-0292)_: SwiftPM supports registries, but there is no widely used public one; adopters
     would have to configure it. Revisit if one appears.
8. **Example app** (P44-T5). `lily-design-system-swift-examples`: an Xcode project with the same three "routes" as the web
   apps: home, a searchable component list (`.searchable`), and a detail screen per component with its live demo, its
   code and its variants. Composed screens: a patient banner, a vaccination record, a contact form with an error summary.
   Every screen passes `performAccessibilityAudit` and the Dynamic Type sweep.
9. **Helpers.** Most web helpers exist because the web lacks a platform setting. On iOS the platform has them:
   - `text-size-picker`, `motion-picker`: **declined**. Dynamic Type and Reduce Motion are system settings; an app that
     overrides them is the defect Lily exists to prevent.
   - `locale-picker`: **declined as a picker**; iOS has a per-app language setting. A helper may open it
     (`UIApplication.openSettingsURLString`).
   - `share-picker`, `search-picker`, `date-time-picker`, `color-picker`: **native** (`ShareLink`, `.searchable`,
     `DatePicker`, `ColorPicker`).
   - `theme-picker`: **keep**, for an app's own brand themes (not light/dark, which is the system's), persisted with
     `@AppStorage`.
   - `time-zone-picker`: **keep**, on Foundation names, ordered by UTC offset as on the web.
   - `data-grid`, `kanban-board`, `calendar`, `gantt-chart`, `filter`, the editors: **defer**. Large, and a mobile design
     of each is its own research. `filter` (its model is already pure) is the likeliest first.
10. **Skill and docs** (P44-T7). `lily-design-system-swift-skill` on the umbrella pattern; a Swift tab in each component
    page's usage section on the docs site once a component ships.

## Not adopted

- **A UIKit catalog.** Doubles the cost for a shrinking audience. UIKit apps host Lily's SwiftUI views with
  `UIHostingController`; Lily documents that and tests one UIKit host screen.
- **Replacing system controls.** No Lily toggle, date picker, sheet, alert, navigation bar or tab bar. They would lose
  VoiceOver behaviour, Liquid Glass, Switch Control and future OS changes.
- **All 661 components.** Parity with the web catalog is not the goal; parity of contracts is.
- **Custom fonts or a Lily look.** As on the web, no identity ships; system fonts by default.
- **Overriding Dynamic Type, motion, contrast or language.**
- **CocoaPods and Carthage.**

## Naming

- Types keep the catalog's PascalCase (`ObservationView`, `IbanInput`, `SummaryList`), namespaced by the module. The
  catalog already writes acronyms as words (`EnglandNationalHealthServiceNumberInput`, `IbanInput`), so Swift and Kotlin
  names match. A `lily` type whose name clashes with a platform type apps commonly import gets a `Lily` prefix: `LilyAlert`
  (`SwiftUI.Alert`), `LilyTimer` and `LilyNotification` (Foundation); recorded in `mobile/components-mobile.tsv`.
- Where the catalog name is also a SwiftUI type (`Button`, `Toggle`, `Picker`, `Menu`, `Label`, `Link`, `Form`, `List`,
  `Section`, `Gauge`, `Table`, `Divider`, `Image`, `ProgressView`), Lily ships **no type**: the decision is `native`, and
  Lily offers a style (`.buttonStyle(.lily)`) and documentation. Shadowing a SwiftUI name breaks every file that imports
  both modules.
- A `-view` suffix stays (`IbanView`): in SwiftUI every component is a view, but the suffix names the read-only half
  of an `-input` / `-view` pair, so it is kept for the pair families only.
- Style protocols: `{Name}Style`, a `{Name}StyleConfiguration`, `.{name}Style(_:)`, built-in `.plain` and `.lily`.

## Testing

- **Unit**: Swift Testing for `LilyCore`, on macOS and Linux, including every shared vector file.
- **Accessibility tree**: UI tests in the example app read each component's accessibility label, value and traits
  through `XCUIElement` and assert them, one test per contract clause, as the web libraries do for ARIA.
- **Audit**: `performAccessibilityAudit()` on every example screen, with each ignored issue listed with a reason (the
  allow-list may only shrink, as elsewhere in Lily).
- **Dynamic Type sweep**: every example screen at the default size, `accessibility3` and `accessibility5`, asserting no
  truncated text in Lily components and no clipped controls; the mobile version of the 320px and 400% sweep.
- **Snapshots**: optional, for the themed styles only; the plain styles are tested by their accessibility tree.
- **Screen readers**: VoiceOver on iPhone and iPad, Voice Control, Switch Control and Full Keyboard Access, recorded in
  `docs/screen-reader-matrix.md` with new columns; a component enters Lily Core for Apple only with that evidence.
- **CI**: Xcode needs macOS. Run on the maintainer's Mac through `bin/ci --job swift` first ([local-ci](../local-ci/index.md));
  a hosted macOS runner is optional and costs nothing for a public repository.

## Acceptance criteria

- [ ] `mobile/semantics.tsv` maps every ARIA role, state and property used in `components/*/AGENTS.md` to SwiftUI, UIKit
      and Compose, or says why none exists.
- [ ] `mobile/components-mobile.tsv` has one row per `components.tsv` slug with an Apple decision and a reason, checked
      in `bin/test`.
- [ ] `shared/vectors/` exists for every shared module a mobile package uses, and the Swift tests read them.
- [ ] `bin/generate-theme-tokens` writes Swift tokens with a `--check`, listed in the Generated files table.
- [ ] `lily-design-system-swift` builds with Swift 6 strict concurrency for iOS 18+, with `LilyCore`, `LilyUI`,
      `LilyIdentifiers` and `LilyThemes`, and no third-party runtime dependency.
- [ ] No Lily component has a hardcoded user-facing string (a Swift `check-worldwide` and `check-built-english` rule).
- [ ] Every shipped component has a documented accessibility and keyboard contract in its `AGENTS.md`, under a new
      "Apple" heading, and a test per clause.
- [ ] The example app passes the accessibility audit and the Dynamic Type sweep on every screen.
- [ ] The export repository resolves as a SwiftPM dependency from a tag in a fresh Xcode project.

## Related topics

- [android-kotlin](../android-kotlin/index.md) — the Android counterpart; Phase 43 is shared.
- [accessibility](../accessibility/index.md), [headless](../headless/index.md), [internationalization](../internationalization/index.md) — the rules this topic translates.
- [theme](../theme/index.md) — DTCG tokens, the source of the Swift tokens.
- [national-identifiers](../national-identifiers/index.md), [healthcare-ui](../healthcare-ui/index.md) — the first components to port.
- [label-packs](../label-packs/index.md), [zone-names](../zone-names/index.md).
- [monorepo-github-pages](../monorepo-github-pages/index.md) — the subtree export the Swift package would reuse.
- [local-ci](../local-ci/index.md), [frameworks](../frameworks/index.md).

## Sources

- Apple, [What's new in SwiftUI (WWDC26)](https://developer.apple.com/wwdc26/guides/swiftui/) and
  [What's new in iOS 27](https://developer.apple.com/wwdc26/guides/ios/).
- [WWDC26: What's new in SwiftUI, a developer's breakdown](https://dev.to/arshtechpro/wwdc26-whats-new-in-swiftui-a-developers-breakdown-1333) (third-party).
- Apple, [Perform accessibility audits for your app (WWDC23)](https://developer.apple.com/wwdc23/10035) and
  [Performing accessibility audits](https://developer.apple.com/documentation/accessibility/performing-accessibility-audits-for-your-app).
- Apple Developer Forums, [Better SwiftUI support in accessibility audits](https://developer.apple.com/forums/thread/851560) (2026).
- Swift.org, [Swift 6.3 released](https://swift.org/blog/swift-6.3-released/); InfoQ, [Swift 6.3: Android and C interop](https://www.infoq.com/news/2026/04/swift-6-3-android-c-interop).
- [SE-0292 Package registry service](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0292-package-registry-service.md).
- Repo: [components.tsv](../../components.tsv), [components-categories.tsv](../../components-categories.tsv),
  [shared/](../../shared/), [themes/tokens/](../../themes/tokens/), [AGENTS/accessibility.md](../../AGENTS/accessibility.md).

---

Lily™ and Lily Design System™ are trademarks.
