# ContentsNav

A contents navigation area.

See `components/contents-nav/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `contents-nav`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Scrollspy

Blazor cannot observe scrolling, and this library has no JS interop, so `Spy="true"` renders data attributes and a
static web asset does the work. Load it once and call `autoInit()`:

```razor
<ContentsNav Label="On this page" Spy="true" SpyOffset="64">
    <ol>
        <li><a href="#introduction">Introduction</a></li>
        <li><a href="#usage">Usage</a></li>
    </ol>
</ContentsNav>
```

```html
<script type="module">
  import { autoInit } from "./_content/LilyDesignSystem.Blazor.Headless/contents-nav-spy.js";
  autoInit();
</script>
```

Parameters: `Spy`, `SpyOffset` (px, default 0), `SpyCurrent` (default `"true"`), `SpyRoot` (CSS selector, default the viewport).
**Deviation:** the component is not told which section is active (that would need JS interop); read `[data-active]` or use
the script's `onChange`. Re-run `autoInit()` after enhanced navigation replaces the nav.

- **Which section is current:** the last one whose top has passed the activation line (`offset` px below the top of the
  scroller). At the bottom of the page the last section is current; above the first section, the first is.
- **What is set:** `aria-current` (default `"true"`) and `data-active` on that link, and `data-descendant-active` on each
  enclosing `<li>`. Style the highlight with more than colour (WCAG 1.4.1). There is no live region: scrolling announces nothing.
- **Clicks:** the clicked link becomes current at once and stays so until the scroll settles (`scrollend`, or 1 s).
- **Not done for you:** smooth scrolling (CSS `scroll-behavior` inside `prefers-reduced-motion: no-preference`), a fixed
  header's offset (`scroll-margin-top` on the targets plus the same `offset`), moving focus, and updating the URL.

## Usage

```razor
<ContentsNav Label="...">
    Content
</ContentsNav>
```
