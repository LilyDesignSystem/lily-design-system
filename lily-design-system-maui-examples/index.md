# Lily Design System™: .NET MAUI examples

A .NET MAUI app that shows Lily on Android, iOS, macOS (Mac Catalyst) and Windows. It has three pages:

- **Native controls**: every general control of [`LilyDesignSystem.Maui`](../lily-design-system-maui/), with real words: an alert, a badge and a tag, inset and warning text, a field whose error fills an error summary, a summary list in a card, and a disclosure.
- **Healthcare**: a result with its flag and range, an early warning score, an age and a duration, a decision support card that refuses a dismissal without a reason, and an International Patient Summary with an allergy list and a medicine.
- **Blazor catalog**: the [Blazor headless library](../lily-design-system-blazor-headless/), unchanged, in a `BlazorWebView`, styled by the light reference theme. Every catalog component works here.

The styles are the app's (`LilyStyles.cs`): Lily's controls set no colour or size, and the app styles them by their class hooks, with the theme's tokens from `LilyTheme.Apply`.

## Run

Needs the .NET 11 SDK and the MAUI workloads (`dotnet workload install maui-android maui-ios maui-maccatalyst`); iOS and Mac Catalyst need Xcode.

```sh
cd src/LilyMauiExamples
dotnet build -t:Run -f net11.0-maccatalyst   # or net11.0-android, net11.0-ios
```

Status: builds for Mac Catalyst and Android (2026-11-26); not yet run under TalkBack, VoiceOver or Narrator (tasks.md P56-T6). Spec: [spec/dotnet-maui](../spec/dotnet-maui/index.md).

---

Lily™ and Lily Design System™ are trademarks.
