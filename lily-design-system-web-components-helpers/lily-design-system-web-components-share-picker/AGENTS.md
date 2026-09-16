# AGENTS — `<lily-share-picker>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless share control, packaged as the
`<lily-share-picker>` custom element. A single-icon button (a bundled
outline-arrow SVG) that uses the **native share sheet** when the
browser has one, and otherwise opens a **disclosure list** of
consumer-supplied destinations plus a built-in copy-the-URL action.
Ships no CSS and no third-party endpoints; the one deliberate
exception to "no icons" is the bundled default button icon.

Ported from the canonical Svelte helper
[`@lilydesignsystem/svelte-share-picker`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-picker/).
Svelte wins on behaviour; this package supplies the custom-element idiom.

## Files

| File                    | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `spec/index.md`         | Specification-driven contract (canonical).        |
| `share-picker.ts`      | Implementation (TypeScript custom-element class). |
| `share-picker.test.ts` | Vitest + jsdom spec, mapped to the §7 clauses.    |
| `index.ts`              | Barrel re-export + side-effectful registration.   |
| `index.md`              | Human-readable guide.                             |
| `docs/accessibility.md` | Tradeoffs, stated plainly.                        |

## Public surface

- Class `SharePicker extends HTMLElement` (registered as
  `<lily-share-picker>` on import of `index.ts`).
- Named exports: `SharePicker`, `canShareNatively`, `canCopy`,
  `nextSharePickerId`.
- No glyph constant — the default icon is a bundled SVG, not a
  Unicode character (reversed 2026-09-16).
- Type exports: `SharePickerProps`, `SharePickerShareDetail`,
  `SharePickerUrlDetail`, `ShareTarget`, `ShareStrategy`.
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
   `ShareTarget.href` is a _function_, so no attribute can carry it, and
   a string-template form would bake in the URL convention this package
   refuses to own. Each callback is paired with a bubbling `CustomEvent`
   — `share`, `copy`, `nativeshare` — which is the primary contract,
   matching how `theme-picker` exposes `themechange`. Callback fires
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

`<lily-share-picker>` contains one rendered
`<div class="share-picker {class}">` holding, in order: a
`<button type="button" class="share-picker-button" aria-label="{label}"
aria-expanded aria-controls="{listId}">` whose content defaults to a
bundled `<svg class="share-picker-icon" aria-hidden="true">` (outline
arrow, not a Unicode character — reversed 2026-09-16); a
`<ul class="share-picker-list" id="{listId}" aria-label="{label}" hidden>` of
`<li class="share-picker-list-item">` containing
`<a class="share-picker-target" data-target-id target="_blank"
rel="noopener noreferrer">` and an optional
`<button class="share-picker-copy">`; and a
`<p class="share-picker-status" aria-live="polite">`.

**Not a menu, and not this catalog's listbox.** The three preference
helpers render `role="listbox"` with `aria-activedescendant`. This one
deliberately does not: destinations are navigation, so they are real
`<a>` elements with no `role` override — `role="menuitem"` or
`role="option"` would strip middle-click, open-in-new-tab and
copy-link-address. Focus moves for real. There is also no hidden
`<input>`: this control carries no value.

The trigger class is `share-picker-button`, following the catalog's
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
  closes and refocuses the trigger, `Tab` puts focus on the trigger
  first and then closes — without cancelling the key, so the default
  Tab proceeds from the picker's position.
- The list carries the picker's accessible name (`aria-label` =
  `label`), matching the sibling pickers' listboxes.
- Three known costs — icon-only naming (and WCAG 2.5.3), platform-split
  behaviour under `strategy="auto"`, and invisible copy failures — are
  recorded in [`docs/accessibility.md`](./docs/accessibility.md).
  `copy-failed-label` should be actionable, not merely truthful. (The
  old font-dependent-glyph tradeoff no longer applies: the icon is a
  bundled SVG, not a Unicode character — reversed 2026-09-16.)

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM); subclassing `renderButtonContent()`
  stands in for the `children` slot the other frameworks expose.
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, images, or third-party URLs. The one
  deliberate exception is the default button icon: a bundled SVG
  (reversed 2026-09-16 from a Unicode glyph).
- All user-facing strings come from attributes / properties — including
  the copy label, which is why the copy item is opt-in.
- Mirrors the Svelte sibling's §7 acceptance criteria.
