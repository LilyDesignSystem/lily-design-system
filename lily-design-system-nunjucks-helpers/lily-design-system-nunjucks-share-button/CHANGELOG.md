# Changelog — ShareButton (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

Initial release. Port of the canonical
`lily-design-system-svelte-share-button` helper to the Nunjucks catalog,
following the catalog's macro + `client.js` split.

### Added

- **`share-button.njk`** — the `shareButton(opts)` macro. Renders a
  `<div class="share-button">` root containing a glyph-only
  `<button class="share-button-trigger">`, a `<ul class="share-button-list" hidden>`
  of destination `<a>` elements plus an optional copy `<button>`, and a
  polite `<p class="share-button-status">` live region. Ids are
  deterministic, derived from `opts.name` (default `"share"`) or an
  explicit `opts.id`.
- **`share-button.client.js`** — the runtime. Owns open/close, real
  focus movement, the keyboard contract, outside-click and focus-out
  dismissal, the `navigator.share` path, and clipboard copy. Exports
  `initShareButton`, `autoInit`, `canShareNatively`, `canCopy`,
  `nextShareButtonId`, `shareTargetHref`, and
  `RIGHTWARDS_ARROW_WITH_HOOK`.
- **`share-button.test.ts`** — 55 vitest cases mapped 1:1 onto the §7
  clauses of `spec/index.md`.
- Docs: `spec/index.md`, `index.md`, `AGENTS.md`, `CLAUDE.md`,
  `docs/accessibility.md`, `docs/ssr.md`, `examples/`.

### Deviation from the canonical Svelte helper — `href` is a string

**This is the one place this port could not follow the canonical API,
and it is deliberate.**

The Svelte helper types a share target's `href` as a function:

```ts
href: (url: string, title: string, text: string) => string;
```

so the consumer builds the whole URL and no endpoint convention is baked
in. **A Nunjucks macro cannot call an arbitrary JavaScript function.**
Templates may call filters and globals registered on the environment and
nothing else; a function passed through `opts` renders as the empty
string. Honouring the canonical signature in the template would have
required every consumer to register a custom filter before the helper
worked at all — which makes it un-droppable-in and puts an escaping
hazard in the consumer's hands.

**So the macro takes each target's `href` as an already-resolved
string:**

```js
{ id: "mastodon", label: "Mastodon", href: "https://…", newTab: true }
```

Three things make this the right trade:

1. The consumer is rendering server-side and **already holds** `url`,
   `title` and `text`. Calling their own URL-builder one line earlier
   costs them nothing.
2. The rendered anchors carry real, final hrefs — which is precisely
   what gives this helper its partial no-JS story (below). A
   function-based macro API could not have produced them.
3. The *contract* is unchanged: the consumer still owns the whole URL,
   and still no third-party endpoint ships.

**The function form survives on the client**, where functions are
callable. `initShareButton(root, {targets})` accepts targets whose
`href` is a function, matches them to the rendered anchors by
`data-target-id`, and rewrites each `href` from the live URL at init and
on every open. `shareTargetHref(target, url, title, text)` is exported
as the pure resolver and accepts **both** forms, so a single `targets`
array can feed the template and the module. A registered Nunjucks filter
is also a function a template may call, so consumers who want the
function ergonomics server-side can have them that way.

Rationale in full: `spec/index.md` §3.3.

### Degradation without JavaScript — partial, and better than the siblings

Unlike `theme-select`, `locale-select` and `text-size-select`, which are
**totally inert** without their client module, this helper degrades
partially:

- **The destination links work.** Real `<a href>` elements with final
  URLs: they navigate, middle-click, open-in-new-tab, and expose "copy
  link address".
- **The list cannot be opened.** It is rendered `hidden` and only the
  client removes that, so the links are unreachable *through the
  control*.
- **Copy does not function.** It is a `<button>` with no handler.
- **The native share sheet is never reached.**

The difference is architectural, not incidental: the `*-select` helpers
apply a *preference* to the document, which is inherently a runtime act,
while this helper's primary affordance is *navigation*, which HTML does
on its own. Stated precisely in `docs/ssr.md`, including how to render a
permanently-open list if full no-JS operation is a hard requirement.

### Notes carried over from the canonical helper

- **No social-network endpoints ship.** No URL templates for X /
  Facebook / LinkedIn / Reddit or anything else. Which networks exist is
  an editorial and privacy decision belonging to the consumer, and share
  URLs change.
- **No default `copyLabel`.** The copy item renders only when the label
  is supplied, because a default would be a hardcoded English string —
  `AGENTS/internationalization.md` forbids it. `copiedLabel` and
  `copyFailedLabel` are likewise undefaulted.
- **A disclosure, not a menu.** Destinations carry **no `role`
  override**; `role="menuitem"` would strip middle-click,
  open-in-new-tab and copy-link-address.
- **The trigger class is `share-button-trigger`**, not
  `share-button-button` — the one deliberate bend in the catalog's
  `{helper}-button` convention, since `.share-button-button` reads
  badly.
- **A dismissed native sheet ends the interaction** and does not fall
  through to the list, which would resurrect UI the user just dismissed.
- **Nothing is persisted and nothing is applied to the document.** This
  is the first helper in the catalog that owns an *action* rather than a
  user preference: no `localStorage`, no `data-*` on the document root.

---

Lily™ and Lily Design System™ are trademarks.
