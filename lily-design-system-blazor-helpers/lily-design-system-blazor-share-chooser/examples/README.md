# Examples

Self-contained Blazor `.razor` examples for
`lily-design-system-blazor-share-chooser`. Each file is a runnable
component that can be dropped into any Blazor 10 host (Blazor Web App,
Blazor Server, Blazor WebAssembly).

Every example assumes:

- The root and list are positioned (`position: relative` /
  `position: absolute`), or an open list shoves the page around. The
  package ships no CSS.
- The example's `@page` route is mounted in the host's `App.razor` with
  an **interactive** render mode.

| # | File | Demonstrates |
|---|------|--------------|
| 1 | [`Basic.razor`](./Basic.razor) | Minimal destinations list plus the copy item and its announcements. |
| 2 | [`Strategies.razor`](./Strategies.razor) | `ShareStrategy.Auto` vs `.List`; `OnShare` / `OnNativeShare`. |
| 3 | [`CustomGlyph.razor`](./CustomGlyph.razor) | `RenderFragment<ShareChooserContext>` — custom button face, state-aware. |
| 4 | [`ExternalActivation.razor`](./ExternalActivation.razor) | Driving the control from your own UI via `ActivateAsync` / `CopyAsync` and a `@ref`. |

## Running the examples

These files are illustrations, not a build. The fastest way to try one
is:

1. Inside any Blazor Web App or Blazor Server project, drop the `.razor`
   file into your `Components/Pages/` directory.
2. Add a project reference to
   `LilyDesignSystem.Blazor.ShareChooser.csproj`.
3. `dotnet run` and visit the `@page` route declared at the top of the
   file.

## Render modes

Every example declares `@rendermode InteractiveServer`. You can swap this
for `InteractiveWebAssembly` or `InteractiveAuto` depending on your
hosting model; the control's behaviour is identical in all three.

**Static SSR is not enough for this helper.** The markup renders, but
`OnAfterRenderAsync` never fires, so nothing can open the share sheet,
write the clipboard, or move focus — the trigger becomes a button that
advertises an affordance it cannot honour. Unlike the `*-select`
helpers, there is no server-side fallback to reach for: this control owns
an action, and an action needs a client. Give the page an interactive
render mode.

## You supply the destinations

No social-network URLs ship with this package, so every example declares
its own `Targets`. That is deliberate: which networks belong in a product
is an editorial and privacy decision, the endpoints change, and networks
die. The URLs in these examples are illustrations of the *shape*, not
endorsements or a maintained list — check any of them against the
network's current documentation before shipping.

`Href` is `(url, title, text) => string`, so you own the whole URL and
its encoding. Use `Uri.EscapeDataString` on anything you interpolate.

## Naming

Blazor parameters are PascalCase: `Label`, `Targets`, `CopyLabel`,
`Strategy`. In `@code` blocks we use camelCase or `_underscore` fields
per .NET conventions.

---

Lily™ and Lily Design System™ are trademarks.
