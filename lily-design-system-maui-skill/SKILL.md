---
name: lily-design-system-maui-skill
description: Explains what Lily Design System offers for .NET MAUI (C# and XAML apps on Android, iOS, macOS and Windows) and which route an agent needs — the native controls in LilyDesignSystem.Maui (the mobile subset, the same controls as Swift and Kotlin, styled with StyleClass and the generated LilyTokens), or the whole catalog through Blazor Hybrid (the Blazor headless library in a BlazorWebView). Use when someone asks how to use Lily in a MAUI app, which MAUI control matches a Lily component, how to theme or test the MAUI controls, or how to show a Lily component MAUI has no native control for.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause OR OGL-UK-3.0 OR CC-BY-SA-4.0
---

# Lily Design System™ — .NET MAUI

Lily reaches a .NET MAUI app two ways. Pick per screen; one app can use both.

## 1. Native controls: `lily-design-system-maui`

[`lily-design-system-maui`](../lily-design-system-maui/) holds two net11.0 libraries, unreleased (tasks.md Phase 56):

- **`LilyDesignSystem.Maui`**: controls on `Microsoft.Maui.Controls` only. General: `LilyAlert`, `LilyBadge`, `Tag`,
  `InsetText`, `WarningText`, `ErrorSummary`, `Field`, `SummaryList` / `SummaryListItem`, `LilyCard`, `Disclosure`.
  Healthcare: `MedicationView`, `ObservationView`, `AgeView`, `DurationView`, `RecordList` / `RecordListItem`,
  `AllergyRecordList` / `AllergyRecordListItem`, `EarlyWarningScoreView`, `DecisionSupportCard`,
  `InternationalPatientSummary` / `InternationalPatientSummarySection`. Themes: `Themes.LilyTokens` and
  `Themes.LilyTheme.Apply(resources, tokens)`.
- **`LilyDesignSystem.Maui.Core`**: the pure rules (`LilySemantics`, `ObservationRules`, `RecordRules`, `IpsRules`, …) and
  the C# copied from Blazor by `bin/sync-maui-core`.

How to use them:

- Every word is a property the app sets (`Label`, `Heading`, `StatusLabel`, `RequiredLabel`); there are no defaults.
- Style a part by its `StyleClass`, the web's kebab-case class (`<Style TargetType="Label" Class="alert-heading">`); style a
  severity with a `DataTrigger` on `Kind`, never a colour alone.
- Theme with `LilyTheme.Apply(Application.Current.Resources, LilyTokens.Light)` and `{DynamicResource lily-color-primary}`.
- Tests: set `LilyAnnouncer.Current` to a recorder and `LilyWarnings.Sink` to a list; read `SemanticProperties` and
  `AutomationProperties` from the constructed control. No device or workload is needed.

## 2. The whole catalog: Blazor Hybrid

For a screen that is web-shaped (a long form, a table, a document), host a `BlazorWebView` and use
[`LilyDesignSystem.Blazor.Headless`](../lily-design-system-blazor-headless/) unchanged, with one of the 65 reference themes'
CSS in `wwwroot`. See [`lily-design-system-blazor-skill`](../lily-design-system-blazor-skill/).

## Which route for a component

Read the component's row in [mobile/components-mobile.tsv](../mobile/components-mobile.tsv) and the rule in
[mobile/index.md](../mobile/index.md#net-maui): `lily` on either platform and in the list above is a MAUI control; `native` on
both is MAUI's own control (`Switch`, `DatePicker`, `SearchBar`); everything else is Blazor Hybrid or not a mobile concern.

## Read next

[spec/dotnet-maui](../spec/dotnet-maui/index.md) (what on par means, the rules), [mobile/semantics.tsv](../mobile/semantics.tsv)
(ARIA to the platforms), and the subproject's [AGENTS.md](../lily-design-system-maui/AGENTS.md).
