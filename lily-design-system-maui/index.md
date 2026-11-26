# Lily Design System™: .NET MAUI

Lily for native apps written with .NET MAUI (C# and XAML) on Android, iOS, macOS and Windows: native controls carrying Lily's
names, accessibility contracts and worldwide rules, unstyled, with every word supplied by the app. Research, decisions and plan:
[spec/dotnet-maui](../spec/dotnet-maui/index.md). Status: **early, unreleased** (tasks.md Phase 56).

There are two ways to use Lily in a MAUI app, and they work together:

- **Native controls** (this subproject): `LilyDesignSystem.Maui`, MAUI controls that map to the platform's own widgets and
  screen reader. They cover the mobile subset of the catalog, the same subset as Swift and Kotlin
  ([mobile/components-mobile.tsv](../mobile/components-mobile.tsv)).
- **The whole catalog in a BlazorWebView**: a MAUI Blazor Hybrid app can use the
  [Blazor headless library](../lily-design-system-blazor-headless) unchanged, all 473 core components and the national
  identifier add-on, styled by any of the 65 reference themes. Use it for screens that are web-shaped (forms, tables, documents).

## Projects

| Project                      | What it is                                                                                                                                                                                                                            | State                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `LilyDesignSystem.Maui.Core` | Pure C#, no UI: `LilySemantics` (the controls' accessibility decisions) and, copied from Blazor by `bin/sync-maui-core`, clinical formatting, the IPS sections, the record-list state and the wheel-picker keys.                      | net11.0; checked against `shared/vectors/`.              |
| `LilyDesignSystem.Maui`      | Controls on `Microsoft.Maui.Controls` only: `LilyAlert`, `LilyBadge`, `Tag`, `InsetText`, `WarningText`, `ErrorSummary` (with `Problem`), `Field`, `SummaryList` / `SummaryListItem`, `LilyCard`; `ILilyAnnouncer` / `LilyAnnouncer`. | First slice (P56-T3). Plain net11.0: no workload needed. |

Planned: the healthcare controls (P56-T4), generated theme tokens as a `ResourceDictionary` (P56-T5), an example app with native
pages and a BlazorWebView page (P56-T6), NuGet publishing (P56-T7).

## Use

```xml
<ContentPage xmlns:lily="clr-namespace:LilyDesignSystem.Maui;assembly=LilyDesignSystem.Maui">
    <VerticalStackLayout>
        <lily:LilyAlert Heading="Saved" Message="Your changes are saved." Kind="Success" Politeness="Polite" />
        <lily:Field Label="Email" Description="We will reply here" Required="True" RequiredLabel="required"
                    Error="{Binding EmailError}">
            <lily:Field.Control>
                <Entry Text="{Binding Email}" Keyboard="Email" />
            </lily:Field.Control>
        </lily:Field>
    </VerticalStackLayout>
</ContentPage>
```

Style a control by its class hook, the same kebab-case name as on the web, with a MAUI style class:

```xml
<Style TargetType="Label" Class="alert-heading">
    <Setter Property="FontAttributes" Value="Bold" />
</Style>
```

## Rules

- **Native first.** A control wraps MAUI's own views (`Label`, `Button`, `Entry`), which map to UIKit, Android views and WinUI,
  so the platform's screen reader, Dynamic Type and keyboard work as the platform intends. Never a custom-drawn control where a
  native one exists.
- **Unstyled.** No colours, fonts, sizes or margins. Each part carries a `StyleClass` hook named after the web's class
  (`alert`, `alert-heading`); a severity or variant is a property (`Kind`) for a `DataTrigger`, never a colour.
- **No words of Lily's own.** Every label, heading, prefix and "required" word is a property the app sets. A missing word stays
  missing; Lily never fills one in English.
- **Accessibility.** The spoken name is `SemanticProperties.Description`, headings use `SemanticProperties.HeadingLevel`, a
  visible copy already in a spoken name is taken out of the tree with `AutomationProperties.IsInAccessibleTree`. MAUI has no
  live-region property, so a control whose text changes in place announces it through `LilyAnnouncer`.

## Verify

`dotnet test LilyDesignSystem.Maui.slnx` here, and `bin/test` from the monorepo root (which runs `bin/sync-maui-core --check`).

---

Lily™ and Lily Design System™ are trademarks.
