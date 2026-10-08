# Settings Picker

Label: a **cog** icon — a gear with a hub, a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph.

A page-header icon button that opens a dropdown panel holding **whatever the app provides**: a few links, buttons, a search form,
a small settings form or list. Like `link-picker` and `share-picker` it is a **disclosure**, not an ARIA menu or listbox: the content is
arbitrary, and `role="menu"` would promise a roving-focus `menuitem` widget (and strip the native semantics of links) that
arbitrary content is not.

Button:

```html
<button
  type="button"
  class="settings-picker-button"
  aria-label="Settings"
  aria-expanded="false"
  aria-controls="settings-picker-panel"
>
  <svg class="settings-picker-icon" viewBox="0 0 16 16" aria-hidden="true">…cog…</svg>
</button>
```

Tooltip (a sibling right after the button, like every picker's):

```html
<div class="settings-picker-tooltip" role="tooltip" id="settings-picker-tooltip" hidden>Settings</div>
```

Panel:

```html
<div class="settings-picker-panel" id="settings-picker-panel" role="group" aria-label="Settings" hidden>
  …whatever the app provides…
</div>
```

## Rules

- **The app provides the content.** The package ships no links, no default content and no English: `label` (the button's and the
  panel's accessible name, and the tooltip text) and everything inside the panel come from the consumer — `children` / a slot /
  `ChildContent` / projected content / light-DOM children / a Nunjucks `{% call %}` body. The content receives (or can reach)
  a `close()`.
- **Closes on select, by default.** Activating a link, a button or a `[role="menuitem"]` inside the panel closes it and returns
  focus to the button; `closeOnSelect=false` turns that off, and a `data-settings-picker-keep-open` ancestor opts one element or
  region out.
- **Focus is not stolen.** A click opens the panel and leaves focus on the button. `ArrowDown`/`ArrowUp` on the button open it
  and move to the panel's first/last focusable element; `Escape` closes (from the button or the panel) and returns focus to the
  button; `Tab` closes with focus on the button first. A click outside, or focus leaving the picker, closes it.
- **Open state is the consumer's to read and set:** a bindable `open` (Svelte `bind:open`, Vue `v-model:open`, Angular
  `[(open)]`, React `open`/`defaultOpen`, Blazor `@bind-Open`, the HTML `open` attribute) with a change notification.
- **Tooltip** (the picker-wide contract): hoverable, dismissable with Escape, never shown while the panel is open, not linked
  with `aria-describedby`.
- **Placement** is the theme's: the 45 `themes/` anchor the popup to the button and flip it at the window edge (see
  [theme](../theme/index.md#picker-popups)).
- **Blazor deviations** (no JS interop, so no JS file ships): no outside-click or focus-out close and no automatic
  close-on-select (`CloseOnSelect` closes on any click inside and defaults to `false`; the content calls `context.Close()`);
  `ArrowDown`/`ArrowUp` focus the panel itself and Tab walks its content.
- **Not in `picker-bar`.** It is a free-standing control; the page-header row composes only link, search, theme, locale,
  text-size and share.

## Packages

`@lilydesignsystem/{svelte,react,vue,angular,html,nunjucks,web-components}-settings-picker` and `LilyDesignSystem.Blazor.SettingsPicker`
(Web Components tag `<lily-settings-picker>`, HTML tag `<settings-picker>`, Angular selector `lily-settings-picker`). The Svelte package's
`spec/index.md` is canonical (21 acceptance clauses); each port has one test per clause (Blazor: 19, see its spec). All
first-released at 0.1.0.

## Related

[helpers](../helpers/index.md) · [menu-picker](../menu-picker/index.md) (the same control with a hamburger) ·
[link-picker](../link-picker/index.md) · [theme](../theme/index.md)
