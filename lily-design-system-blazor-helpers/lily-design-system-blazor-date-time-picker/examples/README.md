# Examples

Self-contained Blazor `.razor` examples for
`lily-design-system-blazor-date-time-picker`. Each file is a runnable
component that can be dropped into any Blazor 10 host (Blazor Web App,
Blazor Server, Blazor WebAssembly).

Every example assumes:

- The dialog is positioned (`position: relative` / `position: absolute`),
  or it renders in normal document flow rather than as an overlay. The
  package ships no CSS.
- The example's `@page` route is mounted in the host's `App.razor` with an
  **interactive** render mode.

| # | File | Demonstrates |
| --- | --- | --- |
| 1 | [`Basic.razor`](./Basic.razor) | Minimal `Date` mode usage: required `Label` + `Labels`, two-way `@bind-Value`, an optional clear button. |
| 2 | [`NhsBooking.razor`](./NhsBooking.razor) | `Mode="DateTime"`, `Min`/`Max`, `IsDateDisabled`, `MinuteStep`, `Shortcuts`, and switching `Locale` + `Labels` together at runtime (English/Welsh). |

## Running the examples

These files are illustrations, not a build. The fastest way to try one is:

1. Inside any Blazor Web App or Blazor Server project, drop the `.razor`
   file into your `Components/Pages/` directory.
2. Add a project reference to
   `LilyDesignSystem.Blazor.DateTimePicker.csproj`.
3. `dotnet run` and visit the `@page` route declared at the top of the
   file.

## Render modes

Every example declares `@rendermode InteractiveServer`. You can swap this
for `InteractiveWebAssembly` or `InteractiveAuto` depending on your
hosting model; the control's behaviour is identical in all three.

**Static SSR renders the markup but cannot operate the control.** Under
static SSR, `OnAfterRenderAsync` never fires, so the Tab focus trap is
never installed and the roving tabindex cannot move under keyboard use —
give the page an interactive render mode.

## Locale drives the calendar, not just the labels

`NhsBooking.razor` switches `Locale` alongside `Labels` for exactly this
reason: month names, the first day of the week, and the numeric field
order for typed input all follow `Locale`, so a language switch changes
the calendar itself, not only the button text around it.

## Naming

Blazor parameters are PascalCase: `Label`, `Labels`, `Mode`, `Min`, `Max`,
`IsDateDisabled`, `Shortcuts`. In `@code` blocks we use camelCase or
`_underscore` fields per .NET conventions.

---

Lily™ and Lily Design System™ are trademarks.
