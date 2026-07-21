# Lily Design System — Nunjucks ShareChooser

A headless share control for Nunjucks 3: a single-glyph button (↪) that
opens the **native share sheet** where the browser provides one, and
otherwise a disclosure list of your destinations plus a built-in **copy
the page URL** action.

Ships zero CSS, zero icons, and **zero third-party endpoints** — you
supply the destinations.

- Specification: [spec/index.md](./spec/index.md)
- Accessibility tradeoffs: [docs/accessibility.md](./docs/accessibility.md)
- Server rendering and no-JS behaviour: [docs/ssr.md](./docs/ssr.md)
- Examples: [examples/](./examples/)

## Install

```sh
npm install lily-design-system-nunjucks-share-chooser
```

## Use

The helper is a **macro + client.js pair**, like every helper in this
catalog. The macro renders the markup; the client module wires the
behaviour.

```njk
{% from "share-chooser.njk" import shareChooser %}

{{ shareChooser({
    label: "Share this article",
    url: absoluteUrl,
    title: title,
    targets: [
        {
            id: "mastodon",
            label: "Mastodon",
            href: "https://mastodon.example/share?url=" + absoluteUrl | urlencode
        },
        {
            id: "email",
            label: "Email",
            href: "mailto:?body=" + absoluteUrl | urlencode,
            newTab: false
        }
    ],
    copyLabel: "Copy link",
    copiedLabel: "Link copied",
    copyFailedLabel: "Could not copy — select the address bar and copy from there"
}) }}
```

```html
<script type="module">
    import { autoInit } from "/js/share-chooser.client.js";
    autoInit();
</script>
```

## The one deviation from the canonical helper: `href` is a string

The canonical Svelte helper types a target's `href` as a **function**,
`(url, title, text) => string`, so the consumer owns the whole URL.

**A Nunjucks macro cannot call an arbitrary JavaScript function.**
Templates may only call filters and globals registered on the
environment; a function passed through `opts` renders as an empty
string. So in this catalog the macro takes each target's `href` as an
**already-resolved string**:

```js
{ id: "mastodon", label: "Mastodon", href: "https://…", newTab: true }
```

You are rendering server-side and already hold the URL, title and text,
so this means calling your own URL-builder one line earlier. Nothing
about the contract changes — you still own the whole URL, and no
endpoint convention ships. Full rationale:
[spec/index.md §3.3](./spec/index.md).

Two places the function form survives:

**On the client**, where functions are callable. Pass function-`href`
targets to `initShareChooser` / `autoInit` and every anchor is rebuilt
from the live URL, at init and on every open:

```js
autoInit({
    targets: [
        {
            id: "mastodon",
            href: (url, title) =>
                `https://mastodon.example/share?url=${encodeURIComponent(url)}` +
                `&text=${encodeURIComponent(title)}`,
        },
    ],
});
```

Targets are matched to anchors by `data-target-id`; anchors you do not
name keep their server-rendered href.

**In a filter**, which *is* a function the template may call. Register
one and build the whole `targets` array server-side — see
[docs/ssr.md](./docs/ssr.md#building-hrefs-in-eleventy-without-repeating-yourself).

## No social networks ship with this package

There are no URL templates for X, Facebook, LinkedIn, Reddit or anything
else, and there will not be. Which networks a site offers is an
editorial and privacy decision belonging to you; share URLs change
without notice; and networks die. You supply `targets`; the package
supplies the control.

## Macro parameters

| Key | Type | Required | Default | Purpose |
| --- | ---- | -------- | ------- | ------- |
| `label` | string | yes | — | Accessible name for the trigger. It is glyph-only, so this is its **only** name. |
| `targets` | array | no | `[]` | Destinations. Empty is valid when `copyLabel` is set. |
| `url` | string | no | — | URL to share. The client falls back to `location.href`. |
| `title` | string | no | `""` | Passed to the native sheet. |
| `text` | string | no | `""` | Passed to the native sheet. |
| `copyLabel` | string | no | — | Label for the copy item. **Omit it and no copy item renders.** |
| `copiedLabel` | string | no | — | Announced after a successful copy. |
| `copyFailedLabel` | string | no | — | Announced when the clipboard write fails. |
| `strategy` | `"auto"` \| `"native"` \| `"list"` | no | `"auto"` | Whether to prefer the native sheet. |
| `name` | string | no | `"share"` | Discriminator used to derive ids. |
| `id` | string | no | `share-chooser-{name}` | Id prefix. Needed when two instances share a `name`. |
| `classes` | string | no | — | Extra classes on the root. |
| `attributes` | object | no | — | Extra HTML attributes on the root. |

Each target: `id` (required), `label` (required), `href` (required
string), `newTab` (default `true`).

There is **no default `copyLabel`**, and none for the other two labels,
because a default would be a hardcoded English string.

## Client API

```js
import {
    initShareChooser,
    autoInit,
    canShareNatively,
    canCopy,
    nextShareChooserId,
    shareTargetHref,
    RIGHTWARDS_ARROW_WITH_HOOK,
} from "lily-design-system-nunjucks-share-chooser";
```

`initShareChooser(root, opts?)` accepts `url`, `title`, `text`,
`strategy`, `targets`, `copiedLabel`, `copyFailedLabel`,
`onShare(id, url)`, `onCopy(url)`, `onNativeShare(url)`. Init opts win
over the rendered attributes. It returns
`{open, close, copy, refreshHrefs, destroy}`.

`shareTargetHref(target, url, title, text)` resolves **both** the
function and string forms, so one `targets` array can feed the template
and the module.

## Strategy

- `"auto"` (default) — native sheet if `navigator.share` exists,
  otherwise the list.
- `"native"` — always attempt the sheet.
- `"list"` — never; always the list.

A **dismissed** native sheet ends the interaction. It does not fall
through to the list, because that would resurrect UI the user just
dismissed.

## Custom glyph

A `{% call %}` block body replaces the glyph inside the button:

```njk
{% call shareChooser({label: "Share this article", targets: targets}) %}
  <svg class="icon" aria-hidden="true" width="16" height="16">…</svg>
{% endcall %}
```

Keep whatever you substitute `aria-hidden="true"` — the accessible name
comes from `label`.

## Styling

No CSS ships. The hooks:

| Class | Element |
| ----- | ------- |
| `.share-chooser` | root `<div>` |
| `.share-chooser-button` | the `<button>` trigger |
| `.share-chooser-icon` | the glyph `<span>` |
| `.share-chooser-list` | the `<ul>`, `hidden` when closed |
| `.share-chooser-list-item` | each `<li>` |
| `.share-chooser-target` | each destination `<a>` |
| `.share-chooser-copy` | the copy `<button>` |
| `.share-chooser-status` | the polite live region `<p>` |

The root `themes/` stylesheets already style these, including the
glyph's optical scale.

## Without JavaScript

The destination links **work** — they are real anchors with final hrefs.
The list **cannot be opened** and copy **does not function**. That
partial degradation is better than the `*-select` helpers manage, and
[docs/ssr.md](./docs/ssr.md) says exactly where the line falls.

## Accessibility in one paragraph

WCAG 2.2 AAA target. A disclosure, not a menu: destinations are real
links with no `role` override, so middle-click, open-in-new-tab and
copy-link-address all survive. Real focus movement, arrows clamping
rather than wrapping, `Escape` returning focus to the trigger. The
accessible name rests entirely on `aria-label`, behaviour differs by
platform under `strategy="auto"`, and copy can fail invisibly — all
three costs are spelled out in
[docs/accessibility.md](./docs/accessibility.md).

## License

MIT

---

Lily™ and Lily Design System™ are trademarks.
