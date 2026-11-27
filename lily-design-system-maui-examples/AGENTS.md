# Lily Design System: .NET MAUI examples — AI coding help

Read [spec/dotnet-maui](../spec/dotnet-maui/index.md) and [`lily-design-system-maui/AGENTS.md`](../lily-design-system-maui/AGENTS.md).

- One MAUI single-project app, `src/LilyMauiExamples`, referencing the MAUI library and the Blazor headless library by project.
- Pages are C# (`Pages.cs`); every word on them is the app's. Styles live in `LilyStyles.cs`, keyed on the controls' style classes.
- `wwwroot/themes/light.css` is a copy of `themes/light.css` for the Blazor page; keep it in step.
- `Platforms/` came from the `maui` template (with the scene manifest Xcode 27 requires); `Resources/` holds the template's icon and splash.

Verify: `dotnet build -f net11.0-maccatalyst` and `-f net11.0-android` in `src/LilyMauiExamples`.
