# AGENTS — `<share-chooser>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless share control, packaged as the
`<share-chooser>` custom element. A single-glyph button (➤, U+27A4) that
uses the **native share sheet** when the browser has one, and otherwise
opens a **disclosure list** of consumer-supplied destinations plus a
built-in copy-the-URL action. Ships no CSS, no icons, and no third-party
endpoints.

Ported from the canonical Svelte helper
[`lily-design-system-svelte-share-chooser`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/).
Svelte wins on behaviour; this package supplies the custom-element idiom.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `share-chooser.ts` | Implementation (TypeScript custom-element class). |
| `share-chooser.test.ts` | Vitest + jsdom spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export + side-effectful registration. |
| `index.md` | Human-readable guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |

## Public surface

- Class `ShareChooser extends HTMLElement` (registered as
  `<share-chooser>` on import of `index.ts`).
- Named exports: `ShareChooser`, `canShareNatively`, `canCopy`,
  `nextShareChooserId`, `BLACK_RIGHTWARDS_ARROWHEAD`.
- Type exports: `ShareChooserProps`, `ShareChooserShareDetail`,
  `ShareChooserUrlDetail`, `ShareTarget`, `ShareStrategy`.
- Instance members beyond the attribute mirrors: `open`, `status`,
  `listId` (getters), `openList(focusLast?)`, `closeList(refocus?)`,
  `items()`, `currentUrl()`, and `renderButtonContent()` — the
  overridable rendering hook.

Required attribute: `label`.

## Two deviations from the cross-framework API — both forced

1. **`share-title`, not `title`.** `title` is a global HTML attribute
   and an `HTMLElement` property; observing it would paint a tooltip
   over the whole control and shadow a platform member. Property is
   `shareTitle`. This is the only renamed prop.
2. **`targets` and the three callbacks are property-only.**
   `ShareTarget.href` is a *function*, so no attribute can carry it, and
   a string-template form would bake in the URL convention this package
   refuses to own. Each callback is paired with a bubbling `CustomEvent`
   — `share`, `copy`, `nativeshare` — which is the primary contract,
   matching how `theme-chooser` exposes `themechange`. Callback fires
   first, then the event.

## Behaviour contract (one paragraph)

Activating the trigger either opens the native sheet (`navigator.share`,
when `strategy` allows and it exists) or opens the list. A **dismissed**
sheet ends the interaction — it must not fall through to the list, which
would resurrect UI the user just dismissed, and it fires nothing.
Destinations are real links built by each target's `href(url, title,
text)`. The copy item writes `currentUrl()` to the clipboard, fires
`onCopy` + the `copy` event, and announces `copied-label` /
`copy-failed-label` in a polite live region; it never throws, including
when there is no clipboard API at all. Nothing is applied to the
document and nothing is persisted — unlike the preference helpers, this
owns an action, not a preference.

## HTML

`<share-chooser>` contains one rendered
`<div class="share-chooser {class}">` holding, in order: a
`<button type="button" class="share-chooser-button" aria-label="{label}"
aria-expanded aria-controls="{listId}">` whose content defaults to
`<span class="share-chooser-icon" aria-hidden="true">&#10148;</span>`; a
`<ul class="share-chooser-list" id="{listId}" hidden>` of
`<li class="share-chooser-list-item">` containing
`<a class="share-chooser-target" data-target-id target="_blank"
rel="noopener noreferrer">` and an optional
`<button class="share-chooser-copy">`; and a
`<p class="share-chooser-status" aria-live="polite">`.

**Not a menu, and not this catalog's listbox.** The three preference
helpers render `role="listbox"` with `aria-activedescendant`. This one
deliberately does not: destinations are navigation, so they are real
`<a>` elements with no `role` override — `role="menuitem"` or
`role="option"` would strip middle-click, open-in-new-tab and
copy-link-address. Focus moves for real. There is also no hidden
`<input>`: this control carries no value.

The trigger class is `share-chooser-button`, following the catalog's
`{helper}-button` convention. (Under the old `share-button` name it was
`share-button-trigger`, because `.share-button-button` read badly; the
rename removed the need for that exception.)

## The `#render` / `#syncState` split

Load-bearing; do not collapse it.

- `#render()` rebuilds the subtree and **closes the list first**,
  because a rebuild cannot preserve focus. Runs on connect, on
  `targets` assignment, and for `label` / `copy-label` / `class`.
- `#syncState()` writes attributes in place — `aria-expanded`, the
  list's `hidden`, each destination's `href`, the status text, the
  trigger content. Never creates or destroys a node, so a state change
  never destroys focus inside an open list. Runs on open/close/announce
  and for `url` / `share-title` / `text`.
- `copied-label` / `copy-failed-label` / `strategy` trigger neither.

The focus-out handler **defers to a microtask** and re-reads
`document.activeElement`, because engines (and jsdom) dispatch
`focusout` with a null `relatedTarget` before focus is committed.

## Accessibility

- WCAG 2.2 AAA target; disclosure pattern with real links.
- Keyboard: trigger `ArrowDown`/`ArrowUp` open on first/last; list
  arrows move and **clamp** (no wrap), `Home`/`End` jump, `Escape`
  closes and refocuses the trigger, `Tab` closes without stealing focus.
- Four known costs — icon-only naming (and WCAG 2.5.3), platform-split
  behaviour under `strategy="auto"`, font-dependent glyph, and invisible
  copy failures — are recorded in [`docs/accessibility.md`](./docs/accessibility.md).
  `copy-failed-label` should be actionable, not merely truthful.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM); subclassing `renderButtonContent()`
  stands in for the `children` slot the other frameworks expose.
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from attributes / properties — including
  the copy label, which is why the copy item is opt-in.
- Mirrors the Svelte sibling's §7 acceptance criteria.
