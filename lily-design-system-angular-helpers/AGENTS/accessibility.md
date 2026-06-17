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
  `spec.md` calls it out.

## The select + combobox contract

Each helper renders a native HTML `<select>`, which carries the
WAI-ARIA `combobox` semantics for free. The helper relies entirely
on the platform `<select>` / `<option>` pairing and adds no grouping
wrapper, no manual selection role, and no manual focus management —
the native control is exactly the combobox widget.

| Element    | Role / Property            | Source        |
| ---------- | -------------------------- | ------------- |
| `<select>` | implicit `role="combobox"` | Browser       |
| `<select>` | `aria-label` (the name)    | Consumer prop |
| `<select>` | `name`                     | Helper        |
| `<option>` | implicit `role="option"`   | Browser       |
| `<option>` | selected state (implicit)  | Browser       |

The helpers do not add ARIA where native semantics already cover the
need. There is no `aria-pressed`, no `aria-checked`, and no manual
focus management — the native `<select>` behaviour is the platform
combobox.

The active state is exposed through independent channels, so no
colour-only meaning is required: the selected `<option>` in the
`<select>`, the `data-*` attribute the helper writes on the document
root (`data-theme`, or `lang` / `dir` for the locale helper), and
the `value` model signal.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key               | Action                                        |
| ----------------- | --------------------------------------------- |
| `Tab`             | Move focus to the select (one stop).          |
| `Shift+Tab`       | Move focus away from the select.              |
| `Arrow Down`      | Select the next option.                       |
| `Arrow Up`        | Select the previous option.                   |
| `Home` / `End`    | Select the first / last option.               |
| Typeahead         | Type characters to jump to a matching option. |
| `Enter` / `Space` | Open the option list (platform-dependent).    |
| `Escape`          | Close the option list.                        |

## Angular-specific gotchas

### `[attr.aria-label]` vs `aria-label`

Use `[attr.aria-label]="label() || null"`, not
`aria-label="{{ label() }}"`. The bracket form binds an attribute
that gets *removed* when the bound expression is `null`. The
interpolation form always emits the attribute — even when the value
is the literal string `""` or the literal string `"null"`.

```html
<!-- Correct -->
<select [attr.aria-label]="label() || null">

<!-- Incorrect — emits aria-label="" or aria-label="null" -->
<select aria-label="{{ label() }}">
```

The signal-input form returns a literal `string` (not `string |
undefined`) when the input is required, but the `|| null` guard
protects against an unset optional input case.

### `[disabled]` and `[selected]`

Use the property bindings (`[selected]`, `[disabled]`) rather than
the attribute bindings (`[attr.selected]`, `[attr.disabled]`) for
boolean DOM properties. The property form correctly toggles the
runtime state without leaving stale attributes in the DOM. The
native `<select>` already reflects the selected option from its
own `value`, so an explicit per-option binding is rarely needed:

```html
<option [value]="theme">{{ labelFor(theme) }}</option>
```

### `host` bindings vs root element bindings

Angular forwards `class`, `style`, and `(event)` bindings declared
on the host element (`<lily-theme-select>`) onto a host node, not
onto the inner `<select>` the helper renders. This means a
consumer who writes `<lily-theme-select class="my-extra">` ends up
with `class="my-extra"` on the *outer* host node, not on the
select. To get a single class hook the consumer can style, the
helpers expose a `className` input that the consumer threads through
to the inner select:

```html
<lily-theme-select [className]="'my-extra'" ... />
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

### `lang` and `dir` on inner options

The `LocaleSelect`'s default template carries `[attr.lang]="tagFor(locale)"`
on each `<option>` so screen readers switch pronunciation per option.
A custom template (when the helpers gain `ng-template`/`ng-content`
slots) must preserve this; the `tagFor` helper is part of the public
contract for that reason.

## Keyboard

The native `<select>` provides Tab / Shift+Tab / Arrow Down / Arrow
Up / Home / End / typeahead / Enter / Space / Escape for free. None
of the helpers add keyboard handlers; if a future helper drops the
native `<select>`, the consumer becomes responsible for keyboard
behaviour.

## Focus management

The helpers never call `.focus()` automatically. Changing the
selection does not move focus elsewhere on the page (WCAG 3.2.2,
On Input). When wiring `(themeChange)` to navigation (`router.navigate`,
imperative `Router.navigateByUrl`), preserve scroll position and
avoid focus jumps.

## Screen-reader pronunciation (locale select)

Each `<option>` carries `lang="…"` so screen readers switch
pronunciation per option (WCAG 3.1.2, Language of Parts). Custom
rendering must keep this attribute on the rendered element.

## Visible focus

The helpers ship no CSS; visible focus is the consumer's CSS
responsibility. Don't suppress `:focus` or `:focus-visible` in
consumer styles.

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
