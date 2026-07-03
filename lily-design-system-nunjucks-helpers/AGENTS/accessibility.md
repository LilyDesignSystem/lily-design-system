# Accessibility — Lily Nunjucks Helpers

The catalog inherits the Lily-wide accessibility commitments
documented in [`shared/headless-principles.md`](./shared/headless-principles.md)
and in the repo-root `AGENTS/accessibility.md`. This file lists the
Nunjucks-specific notes that are easy to miss when porting a helper
from Svelte or Vue.

## Standards

- **WCAG 2.2 AAA** is the target.
- **WAI-ARIA Authoring Practices 1.2** patterns are the reference.
- Semantic HTML first; ARIA only where the canonical helper's
  `spec/index.md` calls it out.

## Nunjucks-specific gotchas

### `autoescape`

`nunjucks.configure({ autoescape: true })` is mandatory. Every
helper's macro emits user-supplied strings (`opts.label`, slug
labels) inside HTML attributes; without autoescape, a label of
`Hello " onclick="alert(1)` would inject script. The shipped
helpers test against `autoescape: true` and document the
requirement at the top of every `index.md`.

### `safe` filter

The macros never call `| safe` on consumer-supplied strings. If a
consumer wants to embed HTML inside a label (a flag emoji, a
bidi-override), they must opt in by passing pre-escaped markup
themselves — typically via `localeLabels` or `themeLabels` after
calling `nunjucks.runtime.markSafe(...)` in their own code.

### Inline `<script>` is forbidden

Macros never emit `<script>` tags. The companion `*.client.js` is
loaded once per page by the consumer; this preserves CSP `script-src`
policies that forbid inline scripts and keeps the macro output a
pure markup contract.

### Whitespace control

The macros use `{%-` / `-%}` everywhere to avoid spurious
whitespace between elements. Whitespace inside `<option>` doesn't
affect accessibility, but the consistent style keeps test
assertions stable.

### Per-option `lang` (locale select)

The locale-select macro emits `<option lang="{tagFor(locale)}">`
for each locale so screen readers pronounce the option text in
its own language (WCAG 3.1.2). Custom-rendering paths must keep
this attribute on the rendered element; the
`docs/accessibility.md` of the locale select walks through the
patterns.

### `aria-label` vs visible label

The helpers carry the consumer's control name as
`aria-label="{label}"` on the root `<select>`. There is no
visible label by default; consumers who want one render their own
markup using the caller-block pattern. See each helper's
`docs/custom-rendering.md`.

### `caller()` block and the combobox contract

When a consumer wraps the macro with `{% call %}` to replace the
default option rendering, the outer `<select>` (implicit
`combobox` role) is preserved. The caller's markup goes
**inside** the select as `<option>` elements; it must not
introduce a competing `role="group"` or `role="listbox"` on the
same node.

If a custom rendering replaces the native `<select>` entirely with
a button group, the consumer must add `aria-pressed`; otherwise
rely on the `<select>`'s implicit combobox role.

## Keyboard

The native `<select>` provides Tab / Shift+Tab / Arrow Up / Arrow
Down / Home / End / typeahead for free. None of the helpers add
keyboard handlers; if a custom rendering replaces the `<select>`,
the consumer becomes responsible for keyboard behaviour.

## Focus management

The client.js never calls `.focus()` automatically. Changing the
selection does not move focus elsewhere on the page (WCAG 3.2.2,
On Input). When wiring `onChange` to navigation, preserve scroll
position and avoid focus jumps.

## Screen-reader pronunciation (locale select)

Each `<option>` carries `lang="…"` so screen readers switch
pronunciation per option (WCAG 3.1.2, Language of Parts). Custom
renderings must keep this attribute on the rendered element.

## Visible focus

The macros ship no CSS; visible focus is the consumer's CSS
responsibility. Don't suppress `:focus` or `:focus-visible` in
consumer styles.

## Reduced motion

The macros and client.js perform no animation. Theme CSS files that
introduce transitions on `data-theme` changes are responsible for
honouring `prefers-reduced-motion`.

## Testing for a11y

vitest + jsdom is enough for ARIA-attribute assertions. For full
audits run axe-core against the rendered page in a real Nunjucks
host (Eleventy site, Express app, Cloudflare Workers route). The
catalog has no built-in axe runner because the helpers ship no CSS
— a meaningful audit must run against the consumer's styled markup.

A quick Eleventy + Playwright + axe pattern:

```js
// .eleventy.js — produces /tmp/site/
// playwright.test.ts:
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("theme select page is accessible", async ({ page }) => {
    await page.goto("/tmp/site/select/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
});
```
