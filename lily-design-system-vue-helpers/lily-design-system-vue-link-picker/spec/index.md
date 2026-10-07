# LinkPicker (Vue) — spec

**Package:** `@lilydesignsystem/vue-link-picker` · **Canonical contract:** the Svelte catalog's spec; this file is its Vue port.
Topic summary: [spec/link-picker](../../../spec/link-picker/index.md).

## 1. Goal

An icon button — a typical **home** icon — that opens a dropdown of **page links the app defines** ("Home", "About Us",
"Contact Us", "Privacy Policy", …). It owns the whole interaction: open/close, focus, keyboard, tooltip. It owns no routes
and no words: every link, and every accessible name, comes from the consumer.

## 2. Non-goals

- No default links, no English text, no routing. A client-side router is supplied through `navigate`.
- Not a site navigation bar and not an ARIA menu: five links behind an icon, in a page header.
- No persistence, no current-page detection (the app marks `current`).

## 3. Architectural decisions

- **A disclosure of real links, not a menu or listbox.** The items are navigation, so they are `<a href>`: `role="menuitem"`
  would strip middle-click, open-in-new-tab and copy-link-address, and the WAI-ARIA APG itself suggests a disclosure when the
  items are links. Same decision as `share-picker`.
- **Only the trigger composes headless** (`IconButton`); the list is self-built for the same reason `share-picker`'s is.
- **The app defines the links** through the required `links` prop. No default, because a default would be a hardcoded string
  and a hardcoded route.
- **`navigate` is optional.** Without it links are ordinary page loads; with it (SvelteKit `goto`) a plain left click is a
  client-side navigation and modified clicks stay native.

## 4. Public API

### 4.1 Props

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `label` | `string` | yes | Accessible name of the button **and** the list; also the tooltip text. |
| `links` | `LinkItem[]` | yes | `{ id?, label, href, current?, newTab? }`. `id` defaults to `href`. |
| `navigate` | `(href: string) => void` | no | Client-side navigation hook (a router's `push`). |
| `navigate` event | `(id: string, href: string)` | no | Emitted after a link is chosen (the Svelte `onNavigate` callback). |
| default slot | `{ open }` | no | Replaces the **icon**, not the links. |
| `class` | `string` | no | Appended to the root class. |

**Differences from the Svelte contract (idiom, not behaviour).** Vue renders the same DOM; the Svelte `onNavigate` callback is an emitted `navigate` event, the icon override is the default scoped slot, and focus is moved after `nextTick`.

### 4.2 DOM contract

```html
<div class="link-picker {class}">
  <button class="link-picker-button" type="button" aria-label="{label}" aria-expanded="false" aria-controls="{id}-list">
    <svg class="link-picker-icon" aria-hidden="true" viewBox="0 0 16 16" …home…/>
  </button>
  <div class="link-picker-tooltip" role="tooltip" id="{id}-tooltip" hidden>{label}</div>
  <ul class="link-picker-list" id="{id}-list" aria-label="{label}" hidden>
    <li class="link-picker-list-item"><a class="link-picker-link" href="/" data-link-id="/">Home</a></li>
    …
  </ul>
</div>
```

The current page's link carries `aria-current="page"`. `newTab` links carry `target="_blank" rel="noopener noreferrer"`.

### 4.3 Re-exports

`default` / `LinkPicker`, `linkId`, `nextLinkPickerId`, types `Props`, `SlotArgs`, `ChildArgs`, `LinkItem`.

## 5. Behaviour

### 5.1 Activation

Click toggles the list. Opening focuses the first link; the page does not scroll (`preventScroll`). Choosing a link closes the
list and returns focus to the button (when the link did not navigate away).

### 5.2 Keyboard

- Button: `ArrowDown` opens and focuses the first link (or moves into an open list); `ArrowUp` opens and focuses the last;
  `Enter`/`Space` toggle.
- List: `ArrowDown`/`ArrowUp` move (clamped, no wrap), `Home`/`End` jump, `Escape` closes and returns focus to the button,
  `Tab` closes and moves on.
- Clicking outside, or focus leaving the picker, closes the list.

### 5.3 Tooltip

`<div class="link-picker-tooltip" role="tooltip" hidden>` holds the button's `label`. Visible while the pointer is over the
button or the tooltip (hoverable) or while the button has keyboard focus (`:focus-visible`); `Escape` dismisses it wherever
focus is; never shown while the list is open. Not linked with `aria-describedby` (it duplicates the name).

## 6. Accessibility

WCAG 2.2 AAA target. The button has an accessible name and `aria-expanded`/`aria-controls`; the icon is `aria-hidden`; the
list is named; links are real links with `aria-current="page"` where marked; focus stays visible; no motion.

## 7. Testing acceptance criteria

The behavioural clauses are the Svelte spec's §7 (open/close, focus, keyboard, `aria-current`, `newTab`, id reporting,
tooltip, no stylesheet / English / routes). This port's suite, `LinkPicker.test.ts`, has 24 tests, one per clause
(§7.1–§7.24), in the same order; where the idiom changes a clause the test name says how. Deviations are listed in §4.1.

## 8. Tracking

- Package: `@lilydesignsystem/vue-link-picker`
- Version: 0.1.0 (new, 2026-10-07)
- Framework: Vue 3 + TypeScript
- Test runner: vitest + @vue/test-utils
