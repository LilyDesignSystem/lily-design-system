# .NET MAUI: Lily for native C# apps

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** .NET MAUI (Multi-platform App UI) is Microsoft's framework for native Android, iOS, macOS and Windows apps from one
C# and XAML codebase, the successor to Xamarin.Forms. Lily reaches it two ways: native controls (`LilyDesignSystem.Maui`) for the
mobile subset of the catalog, the same subset Swift and Kotlin build, and the whole catalog through Blazor Hybrid, where a
`BlazorWebView` runs the Blazor headless library unchanged. Requested by the maintainer on 2026-11-26 as "on par with Blazor,
React, Vue"; this topic says what on par can mean on a platform that is not HTML. Tasks: [Phase 56](../../tasks.md).

## Scope

Covers: the native control library and its pure core, how Lily's rules translate to MAUI, Blazor Hybrid as the route to the full
catalog, packaging, testing and the order of work.

Does not cover: Xamarin.Forms (out of support since May 2024); Uno Platform and Avalonia (other .NET UI frameworks; a request
for either would get its own topic); Tizen (a MAUI workload exists, no adopter has asked).

## What on par means here

The web catalogs are on par because each renders the same semantic HTML for all 661 components. MAUI renders native widgets, not
HTML, so a native port of every row would be wrong for about half of them: a `-nav`, a landmark, a table sub-element or a
`<details>` wrapper has no native equivalent, and building one would fight the platform (the Swift and Kotlin topics reached the
same conclusion; [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) records 138 Apple and 153 Android rows as
`none`). So Lily gives MAUI apps parity in two layers:

| Layer            | What it covers                                                                                                        | How                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Native controls  | The rows whose mobile decision is `lily`: the same controls, names and contracts as Swift and Kotlin.                 | `LilyDesignSystem.Maui`, controls on `Microsoft.Maui.Controls`, mapped by MAUI to UIKit, Android views and WinUI 3.  |
| The full catalog | All 473 core components and the 188 national identifiers, for screens that are web-shaped (forms, tables, documents). | MAUI Blazor Hybrid: `LilyDesignSystem.Blazor.Headless` in a `BlazorWebView`, styled by the reference themes.         |
| Shared logic     | Clinical formatting, IPS sections, record-list state, wheel-picker keys; later identifier validation.                 | `LilyDesignSystem.Maui.Core`, plain C#, copied from Blazor by `bin/sync-maui-core` and checked by `shared/vectors/`. |

A row whose decision is `native` is a MAUI control the app already has (`Switch`, `DatePicker`, `SearchBar`); Lily documents
which to use and adds nothing.

## Principles and rules

- **Native first.** Compose MAUI's own views; never draw a control MAUI has. The platform's screen reader (TalkBack, VoiceOver,
  Narrator), text scaling and keyboard then behave as each platform intends.
- **Pure `Microsoft.Maui.Controls`.** No handlers, no `#if ANDROID`, no platform projects. The library targets plain `net11.0`,
  which an Android, iOS, Mac Catalyst or Windows app consumes unchanged, and which builds and runs its unit tests without the MAUI
  workload. Platform code is added only when a contract cannot be met without it, and then behind an interface with a test double.
- **Headless.** No colour, font, size, margin or shadow. The style hook is MAUI's `StyleClass`, named after the web's kebab-case
  class (`alert`, `alert-heading`); a severity or variant is a typed property (`Kind`) for a `DataTrigger`, the web's `data-type`.
- **Every word from the app.** Labels, headings, prefixes, the word for "required": properties, no defaults, no English. A
  missing word is left out, never filled in. Plural and template text follow [AGENTS/internationalization.md](../../AGENTS/internationalization.md).
- **Accessibility, mapped.** `aria-label` and a merged reading are `SemanticProperties.Description` on a container that is one
  stop, with the visible copies out of the tree (`AutomationProperties.IsInAccessibleTree = false`); headings are
  `SemanticProperties.HeadingLevel` (MAUI, unlike Compose, has levels); moving focus is `SetSemanticFocus()`. MAUI has no
  live-region property, so `role="alert"` and `role="status"` become an announcement through `SemanticScreenReader.Announce`,
  behind `ILilyAnnouncer` so tests can record it; a control announces on load and on change, never on construction.
- **One logic, three languages.** Logic is written once in `shared/` (TypeScript), ported, and every port proved equal by the same
  vectors. Blazor holds the C# port; MAUI copies it (`bin/sync-maui-core`, `--check` in `bin/test`), so C# exists once.
- **Names match the other mobile ports.** `LilyAlert`, `LilyBadge`, `LilyCard`, `Tag`, `Field`, `ErrorSummary`, `SummaryList`,
  as in Swift and Kotlin, so an adopter with three apps reads one vocabulary.

## Testing

- **Unit tests** (xUnit, net11.0): a test per contract clause, reading `SemanticProperties` and `AutomationProperties` from the
  constructed control, and a `RecordingAnnouncer` for announcements. MAUI controls construct without a running app.
- **Vectors**: `shared/vectors/*.json` copied into the test output and run against Core.
- **On devices** (P56-T6, needs the workload): the example app under TalkBack, VoiceOver and Narrator, recorded in
  [docs/screen-reader-matrix.md](../../docs/screen-reader-matrix.md); automated checks with Appium where a platform offers an
  accessibility audit. A unit test proves the properties, not what a screen reader says.

## Packaging

`LilyDesignSystem.Maui.Core` and `LilyDesignSystem.Maui` on NuGet, published from the monorepo as the Blazor packages are
(`bin/publish-headless` or a sibling, a green CI receipt first), with the monorepo as `RepositoryUrl`
(`bin/check-package-metadata`). Versions start at 0.1.0 and follow the support policy in MAINTAINERS.md.

## Order of work

1. Core, `LilySemantics`, the sync script and the first nine controls (done 2026-11-26).
2. The healthcare controls, as Swift and Kotlin have them: `ObservationView`, `AgeView`, `DurationView`, `MedicationView`,
   `AllergyRecordList`, `RecordList`, `EarlyWarningScoreView`, `DecisionSupportCard`, `InternationalPatientSummary`.
3. Tokens: `bin/generate-mobile-tokens` writes a C# `ResourceDictionary` per mobile theme, with light and dark pairs tested at 4.5:1.
4. The example app: native pages for each control and a `BlazorWebView` page with the Blazor catalog. Needs the MAUI workload
   (`dotnet workload install maui`) and, for iOS and Mac Catalyst, Xcode.
5. NuGet, a skill (`lily-design-system-maui-skill`) and a MAUI tab on the docs site.

## Acceptance criteria

- [x] Core and the controls build on net11.0 with warnings as errors, and their tests pass without the workload.
- [x] `bin/sync-maui-core --check` passes in `bin/test`.
- [ ] Every `lily` row on both mobile platforms has a MAUI control, or a reason recorded beside it.
- [ ] The example app runs on Android, iOS, Mac Catalyst and Windows, with a screen-reader session recorded on each.
- [ ] The packages are on NuGet, and a Blazor Hybrid page renders the catalog in the example app.

## Related topics

[apple-swift](../apple-swift/index.md) · [android-kotlin](../android-kotlin/index.md) · [frameworks](../frameworks/index.md) ·
[headless](../headless/index.md) · [accessibility](../accessibility/index.md) · [internationalization](../internationalization/index.md)

## Sources

- [lily-design-system-maui](../../lily-design-system-maui/index.md) · [bin/sync-maui-core](../../bin/sync-maui-core) ·
  [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) · [mobile/semantics.tsv](../../mobile/semantics.tsv)
- [.NET MAUI documentation](https://learn.microsoft.com/dotnet/maui/) ·
  [MAUI accessibility: semantic properties](https://learn.microsoft.com/dotnet/maui/fundamentals/accessibility) ·
  [Blazor Hybrid](https://learn.microsoft.com/aspnet/core/blazor/hybrid/)
- Checked locally on 2026-11-26: .NET SDK 11.0.100 and `Microsoft.Maui.Controls` 11.0.10 build a net11.0 control library and run
  its xUnit tests with no MAUI workload installed.

---

Lily™ and Lily Design System™ are trademarks.
