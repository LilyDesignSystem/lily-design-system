# AGENTS — ShareChooser (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A reusable Angular 20 headless share control. A single-glyph button
(➤, U+27A4) that uses the **native share sheet** when the browser has
one, and otherwise opens a disclosure list of consumer-supplied
destinations plus a built-in copy-the-URL action. Ships no CSS, no
icons, and no third-party endpoints.

Unlike the three preference helpers, this owns an *action*, not a preference:
it applies nothing to the document root and persists nothing. No
`localStorage`, no `data-*` on `<html>`.

## Files

| File                                | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `spec/index.md`                     | Specification-driven contract (canonical).        |
| `share-chooser.component.ts`         | Implementation. Standalone, signal-based, OnPush. |
| `share-chooser.component.spec.ts`    | Vitest spec, mapped to the §7 clauses (47 cases). |
| `docs/accessibility.md`             | Tradeoffs, stated plainly.                        |
| `examples/`                         | Runnable standalone example components.           |
| `index.ts`                          | Barrel re-export.                                 |
| `index.md`                          | User guide.                                       |

## Public surface

- `ShareChooser` (component class, selector `lily-share-chooser`).
- `ShareChooserIcon` (optional marker directive,
  `ng-template[lilyShareChooserIcon]`, for typed `let-` variables).
- `BLACK_RIGHTWARDS_ARROWHEAD` (the default glyph, `"➤"` U+27A4).
- `canShareNatively`, `canCopy` (pure, SSR-safe capability probes).
- `nextShareChooserId` (per-instance id generator).
- Types `ChildArgs`, `ShareTarget`, `ShareStrategy`, `ShareEvent`.

Required input: `label`. Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

Activating the button either opens the native sheet (`navigator.share`,
when `strategy` allows and it exists) or opens the list. A rejected
sheet — the user dismissing it — ends the interaction rather than
falling through to the list. Destinations are real links built by each
target's `href(url, title, text)`. The copy item writes the URL via
`navigator.clipboard.writeText`, emits `copy`, and announces
`copiedLabel` / `copyFailedLabel` in a polite live region; a missing
clipboard API is a failure, never a crash. The URL is resolved lazily
(`url` input, else `location.href`), so SSR never touches `location`.

## HTML

```html
<div class="share-chooser {className}">
  <button type="button" class="share-chooser-button" aria-label="{label}"
          aria-expanded="false" aria-controls="{listId}">
    <span class="share-chooser-icon" aria-hidden="true">➤</span>
  </button>
  <ul class="share-chooser-list" id="{listId}" hidden>
    <li class="share-chooser-list-item">
      <a class="share-chooser-target" data-target-id="{id}" href="{href(...)}"
         target="_blank" rel="noopener noreferrer">{label}</a>
    </li>
    <li class="share-chooser-list-item">
      <button type="button" class="share-chooser-copy">{copyLabel}</button>
    </li>
  </ul>
  <p class="share-chooser-status" aria-live="polite"></p>
</div>
```

**Not a menu.** Destinations are real `<a>` elements with no `role`
override; `role="menuitem"` would strip middle-click, open-in-new-tab
and copy-link-address. The trigger class is `share-chooser-button`,
following the `{helper}-button` convention exactly as the three
preference helpers do.

`@for` is used (not `*ngFor`), tracked by `target.id`. Ids come from
`nextShareChooserId()`, an incrementing module counter — stable, unique
per instance, SSR-safe. A projected `<ng-template>` (queried via
`contentChild(TemplateRef)`) replaces the glyph inside the button and
receives `ChildArgs` (`{ $implicit, open, url }`); it does **not**
render the list.

## Angular deviations from the canonical Svelte helper

- Callbacks are `output()`s: `(share)`, `(copy)`, `(nativeShare)`.
  `share` emits one `ShareEvent` object (`{ targetId, url }`) rather
  than two positional arguments.
- `class` is not a legal Angular input name, so the consumer's class
  hook is `className`, matching the sibling helpers.
- Promise rejections use `.then(ok, err)` rather than `try { await }`.
  Under zone.js a rejection caught only by a native `await` is still
  reported as an unhandled error against the originating click task.

## Accessibility

- WCAG 2.2 AAA target. The glyph is `aria-hidden`; the name comes
  entirely from `aria-label`.
- Button keys: `ArrowDown` / `ArrowUp` open the list on the first / last
  item. List keys: arrows move real focus and **clamp** (no wrap),
  `Home` / `End` jump, `Escape` closes and returns focus to the trigger,
  `Tab` closes without stealing focus back.
- Items are real focusable elements, so focus moves for real — no
  `aria-activedescendant`.
- The button is icon-only, so `aria-label` is its **entire** accessible
  name — a poor label makes the control unusable. See
  [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()` and `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow; template-inline only (no `templateUrl`, no
  `styles`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from inputs — including the copy label,
  which is why the copy item is opt-in.
