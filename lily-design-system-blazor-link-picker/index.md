# LinkPicker (Blazor)

A headless control for **page links**: a single-icon button (a bundled home SVG) that opens a dropdown of links **your app
defines** — "Home", "About Us", "Contact Us", "Privacy Policy". No CSS, no routes, no English.

The single source of truth is [spec/index.md](./spec/index.md); this file is the guide.

## Quick start

```razor
@using LilyDesignSystem.Blazor.Helpers

<LinkPicker Label="Pages" Links="_links" />

@code {
    private readonly List<LinkItem> _links = new()
    {
        new() { Label = "Home", Href = "/" },
        new() { Label = "About Us", Href = "/about/" },
        new() { Label = "Contact Us", Href = "/contact/" },
        new() { Label = "Privacy Policy", Href = "/privacy/" },
    };
}
```

`label` names the button, the list and the tooltip. There is **no default list**: the package ships no routes and no English.

## Client-side navigation

```razor
@inject NavigationManager Navigation
@implements IDisposable

<LinkPicker Label="Pages" Links="Links" />

@code {
    private static readonly (string Label, string Href)[] Pages =
    {
        ("Home", "/"), ("About Us", "/about/"), ("Contact Us", "/contact/"), ("Privacy Policy", "/privacy/"),
    };

    private IReadOnlyList<LinkItem> Links => Pages
        .Select(p => new LinkItem { Label = p.Label, Href = p.Href, Current = Navigation.ToBaseRelativePath(Navigation.Uri).TrimEnd('/') == p.Href.Trim('/') })
        .ToList();
}
```

Ctrl/Cmd/Shift/Alt-click, middle-click and `newTab` links always stay native browser behaviour.

## `LinkItem`

| Field | Notes |
| --- | --- |
| label | Visible text. Yours, so it localises. |
| href | A route (`"/about/"`) or a full URL. |
| id | Reported when a link is chosen; defaults to the href. |
| current | Marks the current page with `aria-current="page"`. |
| newTab | `target="_blank"` with `rel="noopener noreferrer"`. |

## Props

| `Label` | `string` | yes | Accessible name of the button **and** the list; also the tooltip text. |
| `Links` | `IReadOnlyList<LinkItem>` | yes | `{ Id?, Label, Href, Current, NewTab }`. `Id` defaults to `Href`. |
| `OnNavigate` | `EventCallback<LinkNavigateEventArgs>` | no | Fires after a link is chosen (`Id`, `Href`). |
| `ChildContent` | `RenderFragment<LinkPickerContext>` | no | Replaces the **icon**, not the links. |
| `CssClass` | `string` | no | Appended to the root class. |
| `AdditionalAttributes` | | | Captured and spread on the root. |

## Styling

Headless: no CSS ships. Hooks: `.link-picker`, `.link-picker-button`, `.link-picker-icon`, `.link-picker-tooltip`,
`.link-picker-list` (carries `hidden` when closed), `.link-picker-list-item`, `.link-picker-link`. The monorepo's 45 `themes/`
style them all, including the popup placement.

## Examples

[examples/](./examples/README.md): the four-link example, router integration and a custom icon.
