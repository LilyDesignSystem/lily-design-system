# Lily Design System: Swift — specification

The topic spec is [spec/apple-swift](../../spec/apple-swift/index.md); this file tracks this package's own acceptance criteria.
Tasks: [tasks.md Phase 44](../../tasks.md#phase-44--apple-swift-2026-11-22).

## Acceptance criteria

- [x] SwiftPM package with `LilyCore` and `LilyUI`, Swift 6 language mode, iOS 18 / macOS 15, no third-party dependency (P44-T1).
- [x] `swift build`, `swift test` and an iOS Simulator build pass with no warnings (2026-11-22).
- [x] `LilyCore` ports `search-text`, `middle-truncation` and the locale-independent `clinical-format` functions, and passes
      all 88 cases in `shared/vectors/`; a deliberately broken port fails the test (P44-T2, first modules).
- [x] `LilyUI` has the style-protocol pattern and `Field`, `ErrorSummary`, `SummaryList`, `SummaryListItem`, `WarningText` and
      `LilyAlert`, with their accessibility decisions unit-tested in `LilySemantics` (P44-T3, first slice).
- [ ] UI tests of the rendered accessibility tree, one per contract clause, in the example app (P44-T5).
- [ ] `LilyIdentifiers` and `LilyThemes` (P43-T4, P43-T5, P44-T4).
- [ ] An "Apple" section in each shipped component's `components/{slug}/AGENTS.md`.
- [ ] Published through the export repository (P44-T6; needs approval).

## Decisions

- **Accessibility outside the style.** SwiftUI has no unstyled layer, so a component's look is a style protocol, as
  `ButtonStyle` is. The component applies its label, value, hint, traits and announcements to whatever the style returns.
- **Strings are `String`, shown verbatim.** `Text("literal")` would look the string up in a bundle; `Text(verbatim:)` never does,
  so Lily cannot accidentally localise, or fail to localise, an app's words.
- **Visually hidden text becomes a parameter.** iOS has no visually hidden text, so the web's hidden "Warning" prefix is the
  required `prefix` of `WarningText`, spoken as the label with the warning as the value.
- **Required needs a word.** iOS has no required trait; `Field` speaks the consumer's `requiredLabel` in its hint, or nothing.
- **Announcements, not live regions.** `LilyAlert` and a new `Field` error post `AccessibilityNotification.Announcement`, high
  priority for assertive and default for polite.

## Known limitations

- The VoiceOver focus move in `ErrorSummary` uses `@AccessibilityFocusState` on appear, which can be ignored if the summary
  appears in the same update as a layout change; the example app's UI test must confirm it (P44-T5).
- `LilyCore`'s date functions take `Date`s, not ISO strings; callers parse.

---

Lily™ and Lily Design System™ are trademarks.
