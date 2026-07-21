# `<share-chooser>` — Lily Design System HTML helper

A headless share control, packaged as a vanilla custom element. A
single-glyph button (➤) that opens the **native share sheet** where the
browser provides one, and otherwise a **disclosure list** of your
destinations plus a built-in copy-the-URL action.

Ships no CSS, no icons, and **no third-party endpoints** — you supply
the destinations.

Canonical contract: [spec/index.md](./spec/index.md).

## Install

```sh
npm install lily-design-system-html-share-chooser
```

## Quick start

```html
<share-chooser
  id="share"
  label="Share this page"
  copy-label="Copy link"
  copied-label="Link copied to clipboard"
  copy-failed-label="Could not copy — press Ctrl+C to copy the address bar"
></share-chooser>

<script type="module">
  import "lily-design-system-html-share-chooser";

  // `targets` is a JS property, not an attribute: each target's `href`
  // is a function, so there is no honest string encoding for it.
  document.getElementById("share").targets = [
    {
      id: "mastodon",
      label: "Mastodon",
      href: (url, title) =>
        `https://mastodon.social/share?text=${encodeURIComponent(title + " " + url)}`,
    },
    {
      id: "email",
      label: "Email",
      href: (url, title) =>
        `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      newTab: false,
    },
  ];
</script>
```

Importing the module registers `<share-chooser>`. Registration is
idempotent. To control the tag name yourself, import the class from
`lily-design-system-html-share-chooser/share-chooser` instead and call
`customElements.define(...)`.

## No social networks ship with this package

That is deliberate. Which networks exist is an editorial and privacy
decision that belongs to you, share URLs change, and networks die. You
supply `targets`; the package supplies the interaction.

There is also **no default copy label**. A default would be a hardcoded
English string, which
[`AGENTS/internationalization.md`](../../AGENTS/internationalization.md)
forbids — so the copy item renders only when you pass `copy-label`.

## Attributes

| Attribute | Default | Purpose |
| --------- | ------- | ------- |
| `label` | `""` | **Required.** Accessible name for the trigger. |
| `url` | current page URL | URL to share. Resolved lazily. |
| `share-title` | `""` | Passed to `href(...)` and the native sheet. |
| `text` | `""` | Passed to `href(...)` and the native sheet. |
| `copy-label` | — | Label for the copy item. Omit it and no copy item renders. |
| `copied-label` | — | Announced after a successful copy. |
| `copy-failed-label` | — | Announced when the clipboard write fails. |
| `strategy` | `auto` | `auto` \| `native` \| `list`. |
| `class` | `""` | Extra class on the rendered root `<div>`. |

### Why `share-title` and not `title`

`title` is a global HTML attribute: `<share-chooser title="…">` would
paint a native tooltip over the whole control. So the share title is
`share-title` (property `shareTitle`), and `el.title` keeps its ordinary
HTML meaning. It is the only name that differs from the Svelte, React
and Vue versions of this helper.

## Properties and events

Two parts of the API cannot be attributes, because attributes are
strings and these carry functions. Each is exposed as a **property**,
and each callback has a **matching event** — the same way `theme-chooser`
exposes `themechange` and `locale-chooser` exposes `localechange`.

| Property | Event | Detail |
| -------- | ----- | ------ |
| `targets: ShareTarget[]` | — | — |
| `onShare(targetId, url)` | `share` | `{ targetId, url }` |
| `onCopy(url)` | `copy` | `{ url }` |
| `onNativeShare(url)` | `nativeshare` | `{ url }` |

The events are the primary contract; the callbacks are a convenience for
code that already holds an element reference. Both fire, callback first.
All events bubble and are composed.

```js
document.addEventListener("share", (e) => {
  analytics.track("share", e.detail); // { targetId, url }
});

el.onCopy = (url) => console.log("copied", url);
```

A **dismissed** native share sheet fires nothing — it is neither a
success nor an error.

```ts
type ShareTarget = {
  id: string;      // reported back on share
  label: string;   // visible link text — yours, so it localises
  href: (url: string, title: string, text: string) => string;
  newTab?: boolean; // default true
};
```

Every attribute also has a mirrored camelCase property, plus read-only
`open`, `status`, `listId`, and the methods `openList(focusLast?)`,
`closeList(refocus?)`, `items()`, `currentUrl()`.

## Rendered markup

```html
<share-chooser label="Share">
  <div class="share-chooser">
    <button type="button" class="share-chooser-button"
            aria-label="Share" aria-expanded="false" aria-controls="share-chooser-1-list">
      <span class="share-chooser-icon" aria-hidden="true">&#10148;</span>
    </button>
    <ul class="share-chooser-list" id="share-chooser-1-list" hidden>
      <li class="share-chooser-list-item">
        <a class="share-chooser-target" data-target-id="mastodon"
           href="…" target="_blank" rel="noopener noreferrer">Mastodon</a>
      </li>
      <li class="share-chooser-list-item">
        <button type="button" class="share-chooser-copy">Copy link</button>
      </li>
    </ul>
    <p class="share-chooser-status" aria-live="polite"></p>
  </div>
</share-chooser>
```

Two details worth knowing:

- **The trigger's class is `share-chooser-button`**, matching the
  `{helper}-button` convention the sibling helpers use.
- **Destinations are real links with no `role` override.** They are
  navigation, so `role="menuitem"` would strip middle-click,
  open-in-new-tab and copy-link-address. This is why the control is a
  disclosure rather than the listbox the preference helpers use.

## Styling

The package ships no CSS — including the list's positioning. The
`<ul class="share-chooser-list">` renders in normal flow until you give
the root `position: relative` and the list `position: absolute`:

```css
.share-chooser { position: relative; display: inline-block; }
.share-chooser-list {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  min-inline-size: max-content;
}
/* Re-assert the closed state: the rule above would otherwise show it. */
.share-chooser-list[hidden] { display: none; }
.share-chooser-target,
.share-chooser-copy { display: block; inline-size: 100%; text-align: start; }
```

Style the status region as visible text, or hide it visually while
keeping it available to screen readers — do not set `display: none`,
which removes it from the accessibility tree and silences the
announcement.

## Custom glyph

Light DOM has no `<slot>`, so subclassing is the customisation surface.
Override `renderButtonContent()`; it sees `this.open` and
`this.currentUrl()`, the same information the Svelte/React/Vue versions
pass to their `children` slot, and it re-runs on every state change.

```js
import { ShareChooser } from "lily-design-system-html-share-chooser/share-chooser";

class LabelledShareChooser extends ShareChooser {
  renderButtonContent() {
    const frag = document.createDocumentFragment();
    const icon = document.createElement("span");
    icon.className = "share-chooser-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "\u27A4";
    const text = document.createElement("span");
    text.textContent = this.open ? "Close" : "Share";
    frag.append(icon, text);
    return frag;
  }
}
customElements.define("labelled-share-chooser", LabelledShareChooser);
```

## Keyboard

| Key | On the trigger | In the list |
| --- | -------------- | ----------- |
| `Enter` / `Space` | Activates | Activates the focused item |
| `ArrowDown` | Opens, focuses the first item | Moves down, clamping |
| `ArrowUp` | Opens, focuses the last item | Moves up, clamping |
| `Home` / `End` | — | First / last item |
| `Escape` | — | Closes, focus returns to the trigger |
| `Tab` | Moves on | Closes, focus moves on |

Items are real focusable elements, so focus moves for real — no
`aria-activedescendant`.

## Accessibility

WCAG 2.2 AAA target. The real costs are stated plainly in
[docs/accessibility.md](./docs/accessibility.md) — read it before
shipping an icon-only trigger.

## Examples

Runnable pages in [examples/](./examples/).

## Related

- [`lily-design-system-html-theme-chooser`](../lily-design-system-html-theme-chooser/)
- [`lily-design-system-html-locale-chooser`](../lily-design-system-html-locale-chooser/)
- [`lily-design-system-html-text-size-chooser`](../lily-design-system-html-text-size-chooser/)
- [Svelte original](../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/)

---

Lily™ and Lily Design System™ are trademarks.
