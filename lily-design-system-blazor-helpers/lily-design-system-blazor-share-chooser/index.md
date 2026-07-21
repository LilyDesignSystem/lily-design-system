# ShareChooser (Blazor helper)

A headless Blazor 10 share control: a single-glyph button (↪) that opens
the **native share sheet** where the browser has one, and otherwise shows
a list of destinations you supply, plus **copy the page URL**.

Ships no CSS, no JS file, and no third-party endpoints.

The single source of truth is [spec/index.md](./spec/index.md). This file
is the human-readable guide.

## Install

Add a project reference to
`LilyDesignSystem.Blazor.ShareChooser.csproj`, or the published
`LilyDesignSystem.Blazor.ShareChooser` NuGet package.

```xml
<ProjectReference Include="path/to/LilyDesignSystem.Blazor.ShareChooser.csproj" />
```

## Quick start

```razor
@using LilyDesignSystem.Blazor.Helpers

<ShareChooser Label="Share this page"
             Title="An article worth reading"
             Targets="@Targets"
             CopyLabel="Copy link"
             CopiedLabel="Link copied"
             CopyFailedLabel="Could not copy — copy it from the address bar" />

@code {
    private static readonly ShareTarget[] Targets =
    {
        new()
        {
            Id = "mastodon",
            Label = "Mastodon",
            Href = (url, title, _) =>
                $"https://mastodon.social/share?text={Uri.EscapeDataString(title)}%20{Uri.EscapeDataString(url)}",
        },
        new()
        {
            Id = "email",
            Label = "Email",
            Href = (url, title, _) =>
                $"mailto:?subject={Uri.EscapeDataString(title)}&body={Uri.EscapeDataString(url)}",
            NewTab = false,
        },
    };
}
```

`Url` defaults to the current page (read from `NavigationManager`), so
the common case needs no wiring.

The control needs an interactive render mode — `InteractiveServer`,
`InteractiveWebAssembly`, or `InteractiveAuto`. Under static SSR it
renders correctly but cannot act: `OnAfterRenderAsync` never fires, so
nothing can open the sheet, write the clipboard, or move focus.

## You supply the destinations

This package ships **no** social-network URLs. That is deliberate: which
networks belong in your product is an editorial and privacy decision, the
share endpoints change, and networks die. You pass `Targets`, so the
labels localise with the rest of your copy and no third-party endpoint is
baked into a design system.

`Href` is a `Func<string, string, string, string>` — `(url, title, text)`
— so you own the whole URL and its encoding:

```csharp
new ShareTarget
{
    Id = "linkedin",
    Label = "LinkedIn",
    Href = (url, _, _) =>
        $"https://www.linkedin.com/sharing/share-offsite/?url={Uri.EscapeDataString(url)}",
}
```

Set `NewTab = false` on a destination that should open in the same tab —
`mailto:` links being the usual case. It drops `target="_blank"` for that
destination only.

## Native share sheet

With `Strategy.Auto` (the default), pressing the button on a device with
`navigator.share` opens the OS sheet — the user gets their real installed
apps, and nothing is disclosed to a third party by the act of opening it.
Where there is no sheet, the list opens instead.

This means **behaviour differs by platform**, which is worth knowing when
you write help text or test scripts. Force one path with
`Strategy.List` or `Strategy.Native`.

A dismissed sheet ends the interaction — the list does not then pop open,
which would resurrect UI the user just dismissed.

## Copy to clipboard

Supply `CopyLabel` and a copy item appears. There is no default label,
because a default would be a hardcoded English string. `CopiedLabel` and
`CopyFailedLabel` are announced in a polite live region — copying is
otherwise silent, so without them the user gets no confirmation.

Failure is handled, not assumed away: a denied permission, an insecure
context, or a browser with no async clipboard all announce
`CopyFailedLabel` rather than throwing.

## Why links, not a menu

Destinations render as real `<a>` elements, not `role="menuitem"`. A
menuitem role strips middle-click, open-in-new-tab, and copy-link-address
— affordances users genuinely reach for on a share list. The WAI-ARIA APG
suggests a disclosure when the items are links. Copy is a real action, so
it is a `<button>`.

## Driving it from your own UI

`ActivateAsync()`, `CopyAsync()` and `ShareNativelyAsync()` are public,
so a `@ref` lets you trigger the control from elsewhere:

```razor
<ShareChooser @ref="share" Label="Share" Targets="@Targets" />
<button type="button" @onclick="() => share!.ActivateAsync()">Share</button>

@code {
    private ShareChooser? share;
}
```

## Custom glyph

`ChildContent` replaces the glyph inside the button and receives a
`ShareChooserContext` of `{ Open, Url }`:

```razor
<ShareChooser Label="Share" Targets="@Targets">
    <span class="my-icon" aria-hidden="true">@(context.Open ? "▲" : "↪")</span>
</ShareChooser>
```

It replaces the glyph only — it does not render list items.

## Parameters

Full table in [spec/index.md §4.1](./spec/index.md#41-parameters).
Required: `Label`. Everything else is optional.

## Static helpers

| Member | Purpose |
| ------ | ------- |
| `ShareChooser.RightwardsArrowWithHook` | The default glyph, `"↪"` (U+21AA). |
| `ShareChooser.NextShareChooserId()` | Mint a stable, prerender-safe id prefix. |
| `ShareChooser.CanShareNativelyAsync(js)` | Does this browser have a share sheet? |
| `ShareChooser.CanCopyAsync(js)` | Does this browser have an async clipboard? |

Both probes are async — the browser is only reachable over JS interop —
and both return `false` during prerender rather than throwing.

## Accessibility

- The glyph is `aria-hidden`; the name comes from `aria-label`.
- `Escape` closes and returns focus to the button; arrows move between
  items and clamp; `Home` / `End` jump; `Tab` closes and moves on.
- The status region is polite and empty on load.
- **Tradeoff:** an icon-only control's name rests entirely on
  `Label` — there is no visible text fallback. See
  [docs/accessibility.md](./docs/accessibility.md).

## Styling

Class hooks: `.share-chooser` (root), `.share-chooser-button`,
`.share-chooser-icon`, `.share-chooser-list`, `.share-chooser-list-item`,
`.share-chooser-target`, `.share-chooser-copy`, `.share-chooser-status`.

The package ships no CSS. The root [`themes/`](../../themes/)
stylesheets style the button and popup, including the optical glyph
sizing that keeps ↪ visually the same size as the other helpers' glyphs.

Position the root and the list yourself (`position: relative` /
`position: absolute`), or an open list shoves the page around.

## Tests

From `../tests/LilyDesignSystem.Blazor.Helpers.Tests`:

```sh
dotnet test
```

34 cases for this package, one or more per §7 clause; 122 across the
catalog.

---

Lily™ and Lily Design System™ are trademarks.
