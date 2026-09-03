# MotionPicker — Specification (Nunjucks helper)

Ported one-to-one from the Svelte canonical
`lily-design-system-svelte-motion-picker` (see AGENTS/helpers.md:
Svelte is the reference; when catalogs disagree, the Svelte side
wins), with one adaptation: the OS `(prefers-reduced-motion: reduce)`
check is unavailable at template-render time (no `matchMedia` on the
server), so the macro marks `motions[0]` selected server-side and
`motion-picker.client.js` applies the real OS check on init — the
same "server marks something honestly, client refines it" pattern
this catalog's `theme-picker` already uses for its (opt-in)
`prefers-color-scheme` detection.

## 1. Purpose

A headless control that lets a user pick a motion (animation) preference
and have the app remember it. The component owns DOM application +
persistence; the consumer owns the actual `prefers-reduced-motion`
CSS/JS behaviour keyed on `[data-motion="{slug}"]`.

## 2. Scope

In scope: rendering an icon button that opens a WAI-ARIA APG listbox,
resolving the initial value (deferring to the platform's own
`(prefers-reduced-motion: reduce)` media query before falling back to
an arbitrary default), writing `data-motion` to a target, persistence,
change events.
Out of scope: which animations actually get suppressed, transition
choreography, or any visual styling — those are the consumer's CSS/JS,
gated on the `data-motion` attribute this component sets.

## 3. HTML

`<div class="motion-picker {class}">` containing a hidden input
(carries `name`), a `<button class="motion-picker-button"
aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls>` whose only content is the `aria-hidden` pause-sign
glyph (replaceable via `children`), and a `<ul class="motion-picker-list"
role="listbox" aria-label="{label}" tabindex="-1" hidden>` of
`<li class="motion-picker-option" role="option" aria-selected>`
entries, one per slug, with `data-active` mirroring the
`aria-activedescendant` cursor.

## 4. Props

| Prop           | Type                       | Required | Default    |
| -------------- | -------------------------- | -------- | ---------- |
| `label`        | `string`                   | yes      | —          |
| `motions`      | `string[]`                 | yes      | —          |
| `value`        | `string`                   | no       | `""`       |
| `defaultValue` | `string`                   | no       | —          |
| `storageKey`   | `string`                   | no       | —          |
| `name`         | `string`                   | no       | `"motion"` |
| `target`       | `HTMLElement \| null`      | no       | `<html>`   |
| `motionLabels` | `Record<string,string>`    | no       | `{}`       |
| `onChange`     | `(motion: string) => void` | no       | —          |
| `class`        | `string`                   | no       | `""`       |

## 5. Behaviour

On apply: set `data-motion="{slug}"` on `target`; if `storageKey`,
write to `localStorage`; call `onChange(slug)`. Applying is
**idempotent** — a slug already applied is a no-op, so nothing repeats
and `onChange` does not re-fire; the apply effect can run for reasons
other than a motion change, and a consumer whose `onChange` writes
reactive state would otherwise re-enter it until the framework abandons
updating the component, freezing the listbox mid-open with a stale
`aria-expanded` (the concrete Svelte failure mode is
`effect_update_depth_exceeded`; see AGENTS/helpers.md).

Initial value resolves `value` > storage > `defaultValue` > the
platform's `(prefers-reduced-motion: reduce)` preference (`"reduce"`
if offered, else `"no-preference"` if offered) > `motions[0]`. This is
the one place MotionPicker's default differs from its `text-size-picker`
and `theme-picker` siblings: those default to an arbitrary fixed slug
("medium"), because font size and colour scheme have no OS-reported
user preference to defer to. Motion does — `(prefers-reduced-motion:
reduce)` is a real accessibility signal (WCAG 2.3.3, Animation from
Interactions), and a consumer who ships `["no-preference", "reduce"]`
gets an app that already respects the OS setting before anyone touches
the control. SSR-safe: `prefersReducedMotion()` returns `false` when
`window`/`matchMedia` are absent (the server), and the client re-derives
the real value inside `$effect` on mount — never during SSR render, so
no server/client markup mismatch.

`labelFor(slug)` returns `motionLabels[slug]` if present, else the slug
title-cased per hyphen-word (`no-preference` → "No Preference").

Opening an empty list activates no option, so `aria-activedescendant`
is absent rather than pointing at an id that does not exist.

## 6. Accessibility

WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
Interactions, AAA) by giving the user an explicit, persistent override
of the platform's reduced-motion preference. WAI-ARIA APG listbox
pattern: focus moves to the list, the cursor is `aria-activedescendant`,
arrows clamp, `Home` / `End` jump, `PageUp` / `PageDown` move by ten
(clamped), printable characters typeahead over the labels (a single
character advances to the next match and repeats cycle; a
multi-character buffer refines from the active option), `Enter` /
`Space` select and return focus to the button, `Escape` closes without
changing the value. `Tab` closes — after moving focus to the button,
without cancelling the key, so the browser's default Tab proceeds from
the picker's position instead of restarting from `<body>` when the
focused list is hidden.

## 7. Acceptance criteria

- §7.1 Renders an icon button (`aria-haspopup="listbox"`,
  `aria-expanded`, `aria-controls`) and a `role="listbox"` list.
- §7.2 `aria-label` names both the button and the listbox.
- §7.3 One `role="option"` per motion slug; the hidden input carries `name`.
- §7.4 The selected option is `aria-selected`; the cursor is
  `aria-activedescendant`, mirrored to `data-active`.
- §7.5 Default labels title-case the slug; `motionLabels` overrides.
- §7.6 Initial value defers to `(prefers-reduced-motion: reduce)` when
  `defaultValue` and storage are both absent — `"reduce"` if that
  matches and is offered, `"no-preference"` if it doesn't match and is
  offered, else `motions[0]`.
- §7.7 Applies `data-motion` to `document.documentElement`.
- §7.8 Selecting an option with the pointer updates `data-motion`,
  fires `onChange`, and closes the listbox (`aria-expanded="false"`,
  list `hidden`) — the same close `Enter` performs.
- §7.9 Persists to `localStorage` and re-reads on a fresh mount.
- §7.10 An explicit `value` wins over storage, OS preference, and defaults.
- §7.12 Extra attributes spread onto the root.
- §7.13 Custom `children` rendering receives the motion context.
- §7.14 `Tab` from the open list puts focus on the button before
  closing, so the default Tab proceeds from the picker's position.
- §7.15 A repeated typeahead character cycles through its matches;
  a multi-character buffer refines from the active option.
- §7.16 `PageUp` / `PageDown` move the cursor by ten, clamped.
- §7.17 An empty list opens without `aria-activedescendant`.
- §7.18 `onChange` fires once per changed value, not once per effect
  run: a prop change that re-runs the apply effect does not re-fire it.

## 8. Relationship to the other four preference/action helpers

MotionPicker follows the exact icon-button + APG-listbox contract in
AGENTS/helpers.md shared by `theme-picker`, `locale-picker`, and
`text-size-picker` — same markup shape, same keyboard contract, same
idempotent-apply rule, same glyph-escaping discipline. It is additive:
existing catalogs, counts, and contracts for the other four helpers are
unchanged by its introduction.
