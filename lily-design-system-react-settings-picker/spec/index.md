# SettingsPicker (React) — spec

**Package:** `@lilydesignsystem/react-settings-picker` · **Canonical contract:** this file; the other seven catalogs port it.
Topic summary: [spec/settings-picker](../../spec/settings-picker/index.md).

## 1. Goal

An icon button — a typical **cog** (a settings gear) — that opens a dropdown panel holding **whatever the app
provides**: links, buttons, a search form, a small list of settings. It owns the whole interaction: open/close, focus,
keyboard, tooltip. It owns no content and no words: the panel's content and every accessible name come from the consumer.

## 2. Non-goals

- No default content, no English text, no routing, no data.
- Not an ARIA menu: the panel is a named group of arbitrary content, so it has no `role="menu"` and no roving focus.
- Not a site navigation bar (use `BreadcrumbNav`, `SectionNav`) and not a modal dialog (use `Dialog`).
- No persistence.

## 3. Architectural decisions

- **A disclosure of arbitrary content, not a menu.** `role="menu"` promises a roving-focus `menuitem` widget; arbitrary app
  content (links, inputs, headings) is not that, and the WAI-ARIA APG's disclosure pattern fits it exactly. The trigger carries
  `aria-expanded` and `aria-controls`; the panel is a `role="group"` named by `label`.
- **Only the trigger composes headless** (`IconButton`); the panel is self-built, as in `link-picker` and `share-picker`.
- **The app provides the panel's content** through `children` (a render prop, slot, `ChildContent`, children …). It receives
  `{ open, close }` so its own controls can close the panel.
- **Closes on select by default.** Activating a link, a button or a `[role="menuitem"]` inside the panel closes it and returns
  focus to the button. `closeOnSelect={false}` turns that off for the whole panel; an ancestor with
  `data-settings-picker-keep-open` opts one element (or a region, e.g. a form) out.
- **Focus is not moved on a click.** A disclosure must not steal focus on open; `ArrowDown`/`ArrowUp` on the button move into
  the panel's first/last focusable element for keyboard users.

## 4. Public API

### 4.1 Props

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `label` | `string` | yes | Accessible name of the button **and** the panel; also the tooltip text. |
| `open` | `boolean` | no | Controlled open state; omit for an uncontrolled picker. `defaultOpen` sets the initial state. |
| `closeOnSelect` | `boolean` | no | Close when a link/button/menuitem inside is activated. Default `true`. |
| `onOpenChange` | `(open: boolean) => void` | no | Fires when the open state changes. |
| `children` | `ReactNode \| (args: { open, close }) => ReactNode` | no | The panel's content. |
| `icon` | `(args: { open, close }) => ReactNode` | no | Replaces the cog **icon** inside the button. |
| `className` | `string` | no | Appended to the root class. |
| `...rest` | | | Spread on the root. |

### 4.2 DOM contract

```html
<div class="settings-picker {class}">
  <button class="settings-picker-button" type="button" aria-label="{label}" aria-expanded="false" aria-controls="{id}-panel">
    <svg class="settings-picker-icon" aria-hidden="true" viewBox="0 0 16 16" …a cog…/>
  </button>
  <div class="settings-picker-tooltip" role="tooltip" id="{id}-tooltip" hidden>{label}</div>
  <div class="settings-picker-panel" id="{id}-panel" role="group" aria-label="{label}" hidden>
    …whatever the app provides…
  </div>
</div>
```

### 4.3 Re-exports

`default` / `SettingsPicker`, `nextSettingsPickerId`, `FOCUSABLE`, types `Props`, `ChildArgs`.

**Differences from the Svelte contract (idiom, not behaviour).** React renders the same DOM; `class` is `className`, the content is `children` (a node or a render prop receiving `{ open, close }`), the icon override is the `icon` render prop, `open` is controlled with `defaultOpen` for the uncontrolled case, and focus is moved in `useEffect` after the commit. Ids come from `React.useId()` (hydration-safe).

## 5. Behaviour

### 5.1 Activation

Click toggles the panel; focus stays on the button. Activating a link, button or menuitem inside the panel closes it (see
§3) and returns focus to the button.

### 5.2 Keyboard

- Button: `Enter`/`Space` toggle; `ArrowDown` opens and focuses the panel's first focusable element (or moves into an open
  panel); `ArrowUp` focuses the last; `Escape` closes an open panel.
- Panel: `Escape` closes and returns focus to the button; `Tab` closes and moves on (focus goes to the button first so the
  browser continues from the picker's position). Everything else is the app's content's own behaviour.
- Clicking outside, or focus leaving the picker, closes the panel.

### 5.3 Tooltip

`<div class="settings-picker-tooltip" role="tooltip" hidden>` holds the button's `label`. Visible while the pointer is over the
button or the tooltip (hoverable) or while the button has keyboard focus (`:focus-visible`); `Escape` dismisses it wherever
focus is; never shown while the panel is open. Not linked with `aria-describedby` (it duplicates the name).

## 6. Accessibility

WCAG 2.2 AAA target. The button has an accessible name and `aria-expanded`/`aria-controls`; the icon is `aria-hidden`; the
panel is a named group; focus stays visible; no motion. The content's own accessibility is the app's.

## 7. Testing acceptance criteria

1. Renders `div.settings-picker` containing `button.settings-picker-button`, a tooltip and a hidden `div.settings-picker-panel`.
2. The button's accessible name is `label`; it has `aria-expanded="false"` and `aria-controls` pointing at the panel.
3. The default icon is an `aria-hidden` SVG with class `settings-picker-icon`; `icon` replaces it.
4. The panel is a `role="group"` named with `label`.
5. The app's content renders inside the panel; with no content the panel is empty (nothing is invented).
6. Click opens: panel visible, `aria-expanded="true"`, focus stays on the button.
7. Click again closes.
8. `ArrowDown` on the button opens and focuses the first focusable element in the panel; `ArrowUp` focuses the last.
9. `Escape` closes and returns focus to the button.
10. `Tab` closes without teleporting focus.
11. Clicking outside closes.
12. Focus moving out of the picker closes.
13. Activating a link or button inside closes the panel and focuses the button; an element inside
    `data-settings-picker-keep-open` does not close it; `closeOnSelect=false` never closes on select.
14. The content receives `close()`, which closes the panel.
15. `open` is bindable and `onOpenChange` fires once per actual change.
16. The tooltip exists with `role="tooltip"`, holds `label`, and is hidden at rest.
17. The tooltip shows on hover, hides on `Escape`, and never shows while the panel is open.
18. The tooltip is not referenced by `aria-describedby`.
19. `class` is appended to the root; rest props are spread on the root.
20. Two instances get distinct ids.
21. The package source contains no stylesheet, no inline `style` and no English default text.

## 8. Tracking

- Package: `@lilydesignsystem/react-settings-picker`
- Version: 0.1.0 (new, 2026-10-08)
- Framework: React 19 + TypeScript
- Test runner: vitest + @testing-library/react
