# AGENTS — ShareChooser (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Nunjucks 3 + vanilla-JS headless share control. A glyph-only button
(↪, U+21AA) that uses the **native share sheet** when the browser has
one, and otherwise opens a disclosure list of consumer-supplied
destinations plus a built-in copy-the-URL action. Ships no CSS, no
icons, and no third-party endpoints.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time, with the
  destination hrefs already resolved.
- The companion ES module picks up the markup in the browser and owns
  open/close, focus, keyboard, the native sheet, and the clipboard.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `share-chooser.njk` | Nunjucks macro (`shareChooser(opts)`). |
| `share-chooser.client.js` | ES module — `initShareChooser`, `autoInit`, helpers. |
| `share-chooser.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `docs/ssr.md` | Server rendering and the partial no-JS story. |

## Public surface

### Macro

- Import: `{% from "./share-chooser.njk" import shareChooser %}`
- Call: `{{ shareChooser({label, targets, …}) }}`
- Required `opts` key: `label`.
- Full table in [spec/index.md §4.1](./spec/index.md).

### Client.js

`initShareChooser`, `autoInit`, `canShareNatively`, `canCopy`,
`nextShareChooserId`, `shareTargetHref`, `RIGHTWARDS_ARROW_WITH_HOOK`.

## THE DEVIATION — `href` is a string in the macro

The canonical Svelte helper types `href` as
`(url, title, text) => string`. **A Nunjucks macro cannot call an
arbitrary JavaScript function** — only filters and globals registered on
the environment — so a function in `opts` would render as `""`.

The macro therefore takes each target's `href` as an **already-resolved
string**. The consumer is rendering server-side and already holds the
url/title/text, so this costs them one line. Full rationale and the
three reasons it is the right trade: [spec/index.md §3.3](./spec/index.md).

The function form survives in two places:

1. **On the client.** `initShareChooser(root, {targets})` accepts
   function `href`s, matches them to anchors by `data-target-id`, and
   rewrites each href at init and on every open.
2. **In a filter**, which *is* callable from a template.

`shareTargetHref(target, url, title, text)` accepts both forms.

**Do not** attempt to "fix" this by requiring consumers to register a
filter, or by `eval`-ing anything. It is documented, tested, and
deliberate.

## Behaviour contract (one paragraph)

Activating the trigger either opens the native sheet (`navigator.share`,
when `strategy` allows and it exists) or opens the list. A **rejected**
sheet — the user dismissing it — ends the interaction and must NOT fall
through to the list. Destinations are real links; choosing one fires
`onShare(id, url)` and closes. The copy item writes the URL to the
clipboard, fires `onCopy`, and announces `copiedLabel` /
`copyFailedLabel` in a polite live region, never throwing. The share
URL is resolved lazily: init opt → `data-lily-share-chooser-url` →
`location.href`. Nothing is applied to the document and nothing is
persisted — unlike the `*-select` helpers, this owns an action, not a
preference.

## HTML

`<div class="share-chooser" data-lily-share-chooser-root>` →
`<button class="share-chooser-button">` with an `aria-hidden` glyph span
→ `<ul class="share-chooser-list" hidden>` of `<li>` containing
`<a class="share-chooser-target">` and an optional
`<button class="share-chooser-copy">` →
`<p class="share-chooser-status" aria-live="polite">`.

**Not a menu.** Destinations are real `<a>` elements with **no `role`
override**; `role="menuitem"` would strip middle-click, open-in-new-tab
and copy-link-address. `target="_blank" rel="noopener noreferrer"`
unless `newTab: false` (which drops `target`, keeps `rel`).

Ids are deterministic: `{id}-list`, `{id}-target-{i}`, `{id}-copy`,
where `id` defaults to `share-chooser-{name}` and `name` defaults to
`"share"`. Two instances sharing a `name` need an explicit distinct
`id`.

## Accessibility

- WCAG 2.2 AAA target; disclosure pattern, not menu or listbox.
- Real focus movement (no `aria-activedescendant`); arrows **clamp**,
  never wrap; `Escape` returns focus to the trigger; `Tab` closes
  without stealing focus back.
- `aria-label` is the ONLY accessible name the trigger has.
- Known costs, documented honestly in `docs/accessibility.md`: the name
  has no visible fallback; `strategy="auto"` behaves differently per
  platform and the native sheet is untestable from your code; the glyph
  is font-dependent (↪ is in-font and far safer than an emoji, but not
  guaranteed); and copy fails for reasons invisible to the user, so
  `copyFailedLabel` must be actionable.
- **Partial no-JS degradation**, stated precisely in `docs/ssr.md`: the
  destination links work (real hrefs), but the list cannot be opened
  and copy is inert. Better than the `*-select` helpers, still a
  degradation.

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency on the client side beyond standard DOM APIs.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from `opts` — including the copy label,
  which is why the copy item is opt-in.
- No inline `<script>` in the macro output.
- No `localStorage`, and no `data-*` written to the document root.
