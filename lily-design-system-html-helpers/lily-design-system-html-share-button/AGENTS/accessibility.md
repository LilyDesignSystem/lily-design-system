# Accessibility — `<share-button>` (HTML helper)

User-facing version, with the costs stated at length:
[`../docs/accessibility.md`](../docs/accessibility.md). This file is the
agent-facing summary. Catalog-wide rules:
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md).

## This helper breaks the catalog's one-rendering-shape rule — on purpose

The catalog AGENTS file says all helpers render an icon button opening a
`role="listbox"` dropdown with `aria-activedescendant`. `<share-button>`
does **not**, and this is the correct exception:

| | `*-select` helpers | `<share-button>` |
| --- | --- | --- |
| Pattern | Listbox (APG) | Disclosure (APG) |
| Items | `<li role="option">` | `<a>` (no role) + `<button>` |
| Focus | Stays on the `<ul>` | Moves to the real item |
| Active item | `aria-activedescendant` | Real DOM focus |
| Selection | Persists a value | Performs an action |

The reason is that share destinations **are navigation**. A listbox
option or a `role="menuitem"` is not a link: overriding the role strips
middle-click, open-in-new-tab, and copy-link-address — affordances users
rely on for exactly this kind of list. The WAI-ARIA APG itself suggests
a disclosure when the items are links. Copy is a genuine action, so it
is a real `<button>`.

If a future refactor tries to "harmonise" this into a listbox, it is a
regression. Say no.

## What the element guarantees

- Trigger is a real `<button type="button">` with `aria-expanded` and
  `aria-controls` → the `<ul>`.
- Glyph is `aria-hidden="true"`, so the accessible name is `aria-label`
  alone.
- Destinations carry **no** `role`, plus `target="_blank"` and
  `rel="noopener noreferrer"` (the `rel` stays even when `newTab:
  false`).
- Status region is `<p aria-live="polite">`, empty on load, so it
  announces the copy outcome and nothing else.
- No colour-only meaning; nothing auto-animates.
- Focus is never destroyed by a state change (see
  [`lifecycle.md`](./lifecycle.md)).

## Keyboard contract

| Key | Trigger | List |
| --- | ------- | ---- |
| `Enter` / `Space` | Native activation | Native activation of the item |
| `ArrowDown` | Open, focus first | Move down, **clamp** |
| `ArrowUp` | Open, focus last | Move up, **clamp** |
| `Home` / `End` | — | First / last |
| `Escape` | — | Close, refocus trigger |
| `Tab` | Move on | Close, focus goes where the browser sends it |

`Enter` / `Space` are deliberately **not** handled on the trigger: they
are the button's own activation keys and already produce a click.
Handling them would double-fire.

Arrows **clamp, they do not wrap**. The ends of a short disclosure list
are a real boundary, and wrapping disorients. A mutation test guards
this.

## The four costs

Recorded in full in [`../docs/accessibility.md`](../docs/accessibility.md);
do not soften them:

1. **The name rests entirely on `aria-label`** — no visible text
   fallback. WCAG 2.5.3 Label in Name bites if visible text is added
   later without updating the label.
2. **`strategy="auto"` splits behaviour by platform.** On a phone the OS
   sheet opens and the consumer's `targets` are never shown. Only
   `strategy="list"` guarantees they are reachable.
3. **The glyph is font-dependent.** ↪ is in-font and far safer than an
   emoji, but a font lacking U+21AA renders tofu.
4. **Copy fails invisibly** — insecure context, denied permission,
   unfocused document, or no API at all. The announcement is the entire
   recovery path, so `copy-failed-label` must be *actionable*, and
   omitting `copied-label` / `copy-failed-label` is silent failure.

## Review checklist

- No `role` on any `.share-button-target`.
- `rel="noopener noreferrer"` present regardless of `newTab`.
- Arrows clamp.
- `Escape` returns focus to the trigger; `Tab` does not.
- Status region is never `display: none` in example CSS — that removes
  it from the accessibility tree and silences the announcement.
- A dismissed native sheet does not reopen the list.
