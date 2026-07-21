# Accessibility — Lily Angular Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
Angular-specific notes that are easy to miss when porting a helper
from Svelte to Angular.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec/index.md` calls it out.

## The icon button + listbox contract

All three helpers render an icon button that opens a custom
[WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).
None of them uses a native `<select>` any more — `theme-chooser` and
`locale-chooser` migrated first, and `text-size-chooser` joined them,
so the three are structurally identical.

There is **no native control underneath**. Every role, state, focus
move, and keystroke is code in the component rather than behaviour
supplied by the browser. That is the single most important thing to
know when porting or reviewing a helper here.

| Element                 | Role / Property                                         | Source        |
| ----------------------- | ------------------------------------------------------- | ------------- |
| root `<div>`            | none — a container, not a control                       | —             |
| `<input type="hidden">` | `name`, `value` (form participation)                    | Helper        |
| `<button>`              | implicit `role="button"`                                | Browser       |
| `<button>`              | `aria-label` — its **entire** accessible name           | Consumer prop |
| `<button>`              | `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` | Helper    |
| `.{helper}-icon`        | `aria-hidden="true"`                                    | Helper        |
| `<ul>`                  | `role="listbox"`, `aria-label`, `tabindex="-1"`         | Helper        |
| `<ul>` (open only)      | `aria-activedescendant`                                 | Helper        |
| `<li>`                  | `role="option"`, `aria-selected`                        | Helper        |
| `<li>`                  | `data-active` — styling hook, **not** ARIA              | Helper        |

`data-active` marks where the keyboard cursor is; `aria-selected`
marks the value actually in effect. They are usually on different
options — never treat them as interchangeable.

Element ids come from each helper's module-counter id generator
(`nextThemeChooserId`, `nextLocaleChooserId`, `nextTextSizeChooserId`)
— deterministic, unique per instance, and identical across server and
client renders, so the wiring survives hydration. Never use
`Math.random` or `Date.now`.

The active state is exposed through independent channels, so no
colour-only meaning is required: `aria-selected` on the chosen
option, the hidden input's value, the attribute the helper writes on
the document root (`data-theme`, `lang` / `dir`, `data-text-size`),
and the `value` model signal.

## Keyboard contract

Implemented by the component, identically across all three helpers.

On the **button**:

| Key               | Action                                                              |
| ----------------- | ------------------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / away from the button (one stop).                  |
| `Enter` / `Space` | Open the listbox with the selected option active (index 0 if none). |
| `Arrow Down`      | Same as `Enter` / `Space`.                                          |
| `Arrow Up`        | Open the listbox with the **last** option active.                   |

Opening moves focus to the `<ul>`; focus never lands on an `<li>`.

On the **listbox**:

| Key               | Action                                                                |
| ----------------- | --------------------------------------------------------------------- |
| `Arrow Down`      | Active option down one. **Clamps** at the last option — no wrap.       |
| `Arrow Up`        | Active option up one. **Clamps** at the first option — no wrap.        |
| `Home` / `End`    | First / last option becomes active.                                    |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`          | Close and return focus to the button; the value is **not** changed.    |
| `Tab`             | Close without stealing focus back; the browser moves focus onward.     |
| Printable chars   | Typeahead over the display **labels**; the buffer resets after 500 ms. |

Clicking an option selects it; clicking outside the root, or focus
leaving the root, closes without changing the value.

## The tradeoffs are documented, not solved

Each helper's `docs/accessibility.md` states the same three tradeoffs
plainly, and new helpers must do the same rather than glossing them:

1. The button is icon-only, so `aria-label` is its entire accessible
   name — which is why `label` is `input.required`.
2. A hand-rolled listbox has weaker, less consistent
   assistive-technology support than a native `<select>`, and loses
   the mobile platform picker. A native `<select>` remains the better
   control for some audiences; choosing one over these helpers is a
   legitimate decision.
3. The default glyph is font-dependent. `theme-chooser`'s `◑` (U+25D1)
   may render as tofu or in an unexpected weight;
   `text-size-chooser`'s `"A"` (U+0041) is materially safer, being an
   ordinary letter in the page's own font.

The compensating pattern — a visible `aria-live="polite"` status
region reporting the active value — is the **default** in every
helper's examples and quick-start, not a suggestion, because the
closed button never announces its value.

## Angular-specific gotchas

### `[attr.aria-label]` vs `aria-label`

Use `[attr.aria-label]="label() || null"`, not
`aria-label="{{ label() }}"`. The bracket form binds an attribute
that gets *removed* when the bound expression is `null`. The
interpolation form always emits the attribute — even when the value
is the literal string `""` or the literal string `"null"`.

```html
<!-- Correct -->
<button [attr.aria-label]="label() || null">

<!-- Incorrect — emits aria-label="" or aria-label="null" -->
<button aria-label="{{ label() }}">
```

The signal-input form returns a literal `string` (not `string |
undefined`) when the input is required, but the `|| null` guard
protects against an unset optional input case. Both the button and
the listbox carry it.

### `[attr.hidden]` and `[attr.data-active]`

The listbox visibility and the keyboard cursor are attribute
bindings with a `null` sentinel, so the attribute is *absent* rather
than present-and-empty when off:

```html
<ul [attr.hidden]="open() ? null : ''">
  <li [attr.data-active]="i === activeIndex() ? '' : null">
```

`aria-activedescendant` follows the same rule — it is emitted only
while the listbox is open, via a `computed()` that returns `null`
when closed.

### `host` bindings vs root element bindings

Angular forwards `class`, `style`, and `(event)` bindings declared
on the host element (`<lily-theme-chooser>`) onto a host node, not
onto the inner root `<div>` the helper renders. This means a
consumer who writes `<lily-theme-chooser class="my-extra">` ends up
with `class="my-extra"` on the *outer* host node, not on the root
`<div>`. To get a single class hook the consumer can style, the
helpers expose a `className` input that the consumer threads through
to the inner root:

```html
<lily-theme-chooser [className]="'my-extra'" ... />
```

This is the Angular equivalent of Vue's `inheritAttrs`-driven
fall-through. The helpers don't (yet) expose host-level
`@HostBinding('class')` plumbing because it complicates the SSR
contract.

### `[(value)]` doesn't auto-focus

Two-way model bindings don't move focus. When the consumer
programmatically writes to `value`, the focused element stays put —
which is the WCAG 3.2.2 (On Input) contract.

### `aria-current` is consumer-supplied

The helpers don't add `aria-current` automatically. When you build
a multi-item navigation that needs it, set it via an `[attr.aria-current]`
binding inside your own template (or inside a custom slot, when one
exists).

### `lang` on inner options

The `LocaleChooser`'s default template carries
`[attr.lang]="tagFor(locale)"` on each `<li role="option">` so screen
readers switch pronunciation per option. `tagFor` is part of the
public contract for that reason.

### A projected template cannot change the ARIA contract

Each helper accepts one projected `<ng-template>`, queried via
`contentChild(TemplateRef)`, that replaces the **button glyph** — not
the listbox, not the options, not any ARIA attribute. If a consumer
projects text rather than a decorative glyph, the button then has
both text content and an `aria-label`; `aria-label` wins in the
accessibility tree, so the two must agree (WCAG 2.5.3, Label in
Name).

## Focus management

Unlike the earlier native-`<select>` shape, these helpers **do** move
focus, and must do so precisely:

- Opening moves focus to the `<ul>` (inside `queueMicrotask`, after
  the `hidden` attribute is cleared — focusing a hidden element is a
  no-op).
- Selecting with `Enter` / `Space`, and dismissing with `Escape`,
  return focus to the button.
- `Tab`, an outside click, and focus leaving the root close the
  listbox **without** pulling focus back — the browser's own focus
  movement must win.

Changing the value programmatically via `[(value)]` never moves focus
(WCAG 3.2.2, On Input). When wiring `(themeChange)` to navigation,
preserve scroll position and avoid focus jumps.

## Screen-reader pronunciation (locale chooser)

Each `<li role="option">` carries `lang="…"` so screen readers switch
pronunciation per option (WCAG 3.1.2, Language of Parts). Custom
rendering must keep this attribute on the rendered element.

## Visible focus

The helpers ship no CSS; visible focus is the consumer's CSS
responsibility. Don't suppress `:focus` or `:focus-visible` in
consumer styles.

Two elements take focus and both need a visible ring: the
`.{helper}-button`, and the `.{helper}-list` while open. Because the
`<ul>` holds focus for the whole open interaction, a listbox with no
focus indicator leaves a keyboard user with nothing on screen tying
the highlighted option to their keystrokes. Style
`.{helper}-list:focus-visible` and `.{helper}-option[data-active]`
together. The consumer also owns the listbox positioning — with no
CSS the list sits in normal flow and shoves the page around when it
opens.

## Reduced motion

The helpers perform no animation. Theme CSS files that introduce
transitions on `data-theme` changes are responsible for honouring
`prefers-reduced-motion`.

## Testing for a11y

vitest + jsdom is enough for ARIA-attribute assertions. For full
audits run axe-core against a built Angular app (Vite + Analog, or
the Angular CLI dev server). The catalog has no built-in axe runner
because the helpers ship no CSS — a meaningful audit must run
against the consumer's styled markup.

```ts
// Example axe-core spec from a consumer app's Playwright suite:
import AxeBuilder from "@axe-core/playwright";

test("settings page is axe-clean", async ({ page }) => {
    await page.goto("/settings");
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations).toEqual([]);
});
```
