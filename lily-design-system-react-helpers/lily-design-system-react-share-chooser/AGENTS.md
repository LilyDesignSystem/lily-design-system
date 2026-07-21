# AGENTS — ShareChooser (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A React 19 headless share control. A single-glyph button (➤, U+27A4)
that uses the **native share sheet** when the browser has one, and
otherwise opens a disclosure list of consumer-supplied destinations plus
a built-in copy-the-URL action. Ships no CSS, no icons, and no
third-party endpoints.

Ported from the canonical Svelte helper
(`../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/`),
whose spec numbering this package mirrors clause for clause.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `ShareChooser.tsx` | Implementation. React 19 hooks + TypeScript. |
| `ShareChooser.test.tsx` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable React 19 examples. |

## Public surface

Default export `ShareChooser`; named `ShareChooser`, `canShareNatively`,
`canCopy`, `nextShareChooserId`, `BLACK_RIGHTWARDS_ARROWHEAD`; types
`Props`, `ChildArgs`, `ShareTarget`, `ShareStrategy`.

Required prop: `label`. Optional `children` is a render prop that
replaces the **glyph** inside the button and receives `{ open, url }` —
it does not render the list.

## Behaviour contract (one paragraph)

Activating the button either opens the native sheet
(`navigator.share`, when `strategy` allows and it exists) or opens the
list. Destinations are real links built by each target's `href(url,
title, text)`. The copy item writes `url` to the clipboard, fires
`onCopy`, and announces `copiedLabel` / `copyFailedLabel` in a polite
live region. Nothing is applied to the document and nothing is
persisted — unlike the `*-chooser` helpers, this owns an action, not a
preference.

## HTML

`<div class="share-chooser">` → `<button class="share-chooser-button">`
with an `aria-hidden` glyph span → `<ul class="share-chooser-list" hidden>`
of `<li>` containing `<a class="share-chooser-target">` and an optional
`<button class="share-chooser-copy">` → `<p class="share-chooser-status"
aria-live="polite">`.

**Not a menu.** Destinations are real `<a>` elements; `role="menuitem"`
would strip middle-click, open-in-new-tab and copy-link-address. The
trigger class is `share-chooser-button`, following the same
`{helper}-button` convention as the sibling helpers.

## React specifics an agent will trip over

- The list id comes from `React.useId()`, as in the sibling helpers, so
  it survives hydration. `nextShareChooserId()` is exported for parity
  with Svelte but is **not** what the component uses.
- Focus moves in a `useEffect` keyed on `open`, not in the handler: the
  items do not exist until the open is committed. `pendingFocusRef`
  carries whether to land on the first or last item; `refocusRef`
  carries whether a close should return focus to the trigger.
- Focus-out uses React's `onBlur` on the root, which is the delegated
  equivalent of native `focusout` (it bubbles; DOM `blur` does not).
- `Props` omits `children`, `title`, and `onCopy` from
  `React.HTMLAttributes<HTMLDivElement>` because all three are
  redefined with share-specific meanings.
- Unlike the `*-chooser` siblings there is no `aria-activedescendant`:
  the items are real focusable elements, so focus moves for real.

## Conventions this package follows

- React 19 function components with hooks; strict TypeScript on the
  public surface.
- No runtime dependency beyond `react`.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from props — including the copy label,
  which is why the copy item is opt-in.
