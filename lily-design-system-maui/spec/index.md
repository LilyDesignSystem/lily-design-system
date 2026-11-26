# Lily Design System™: .NET MAUI — specification

The topic, with the research and the decisions: [spec/dotnet-maui](../../spec/dotnet-maui/index.md). Tasks: tasks.md Phase 56.

## Contract

- `LilyDesignSystem.Maui.Core` holds no UI and depends on nothing but the base class library.
- `LilyDesignSystem.Maui` depends on `Microsoft.Maui.Controls` and Core only; it targets net11.0 and has no platform code.
- Every control: a `StyleClass` hook named after its slug; a property per consumer-supplied word, no default text; a spoken
  name through `SemanticProperties`; visible copies of a spoken name out of the accessibility tree; announcements of text that
  changes in place through `LilyAnnouncer`, never on construction.
- Core's `Shared/` copies equal the Blazor sources but for the namespace (`bin/sync-maui-core --check`).

## Acceptance

- [x] Core and the first nine controls build on net11.0 without the MAUI workload, with `TreatWarningsAsErrors`.
- [x] A test per contract clause, and the IPS vectors from `shared/vectors/`.
- [ ] The healthcare controls, the theme tokens, the example app and the NuGet packages (tasks.md P56-T4 to T7).
