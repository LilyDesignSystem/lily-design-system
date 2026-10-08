# SettingsPicker (Blazor helper)

A headless Blazor control for **a dropdown of whatever your app provides**: a single-icon button (a bundled
cog SVG) that opens a panel you fill with links, buttons, a search form, a few settings — anything.

The single source of truth is [spec/index.md](./spec/index.md). This file is the human-readable guide.

## Install

```sh
dotnet add package LilyDesignSystem.Blazor.SettingsPicker
```

```razor
@using LilyDesignSystem.Blazor.Helpers
```

## Quick start

```razor
<SettingsPicker Label="Settings">
    <ChildContent Context="menu">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about/">About Us</a></li>
            <li><button type="button" @onclick="SignOut">Sign out</button></li>
        </ul>
    </ChildContent>
</SettingsPicker>
```

`Label` is the button's accessible name, the panel's name and the tooltip text. There is **no default content**: the package
ships no links and no English, so the panel's content, and every word on it, is yours.

## Closing from your content

The context has `Open` and `Close()`:

```razor
<SettingsPicker Label="Settings">
    <ChildContent Context="menu">
        <form @onsubmit="() => { Search(); return menu.Close(); }">
            <input type="search" aria-label="Search" @bind="_query" />
        </form>
    </ChildContent>
</SettingsPicker>
```

## What differs in Blazor

Blazor has no JS interop here (no JS file ships), so: there is **no outside-click or focus-out close** and **no automatic
close-on-select** (`CloseOnSelect="true"` closes on *any* click inside); `ArrowDown`/`ArrowUp` on the button focus the panel
itself and Tab then walks its content. The panel closes on the button, on `Escape`, and when your content calls `menu.Close()`.

## Parameters

`Label` (required), `Open` / `OpenChanged` (`@bind-Open`), `CloseOnSelect` (default `false`), `ChildContent` (the panel's
content), `Icon` (replaces the **icon**, not the content), `CssClass`, plus unmatched attributes on the root.

## Styling

Headless: no CSS ships. Target `.settings-picker`, `.settings-picker-button`, `.settings-picker-icon`, `.settings-picker-tooltip`,
`.settings-picker-panel`. The 45 reference themes in the monorepo's `themes/` style all of them, including the popup placement.

## Examples

[examples/](./examples/README.md): a links panel, a panel with a form and `close`, and a custom icon.
