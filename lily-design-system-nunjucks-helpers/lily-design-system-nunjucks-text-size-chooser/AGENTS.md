# AGENTS — TextSizeChooser (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless text-size chooser that
applies the chosen size to the document root via `data-text-size`,
with optional `localStorage` persistence. Ships no CSS; consumer
styles the `text-size-chooser` class hooks and maps each
`[data-text-size="…"]` slug to real typography.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time.
- The companion ES module picks up the markup in the browser and
  owns both the lifecycle (storage, `data-text-size` application,
  change events) and the whole listbox interaction.

**BREAKING (Unreleased):** this helper no longer renders a native
`<select>`. It renders an icon button (U+0041 LATIN CAPITAL LETTER A)
that opens a listbox, matching `theme-chooser` and `locale-chooser`.

## Files

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec/index.md`               | Specification-driven contract (canonical).       |
| `text-size-chooser.njk`        | Nunjucks macro (`textSizeChooser(opts)`).         |
| `text-size-chooser.client.js`  | ES module — `initTextSizeChooser`, `autoInit`, `sizeName`, glyph. |
| `text-size-chooser.test.ts`    | Vitest spec, one assertion per §7 acceptance.    |
| `index.md`                    | Concise user guide.                              |
| `docs/accessibility.md`       | Roles, keyboard contract, and the honest tradeoffs. |
| `docs/ssr.md`                 | Server rendering, first paint, and the no-JS regression. |

## Public surface

### Macro

- Import: `{% from "./text-size-chooser.njk" import textSizeChooser %}`
- Call:   `{{ textSizeChooser({label, sizes, …}) }}`
- Required `opts` keys: `label`, `sizes`.
- Full table in [spec/index.md §4.1](./spec/index.md#41-macro-parameters).

### Client.js

- `import { initTextSizeChooser, autoInit, sizeName, LATIN_CAPITAL_LETTER_A } from "./text-size-chooser.client.js"`
- `sizeName(slug)` mirrors theme-chooser's `themeName` and
  locale-chooser's `localeName`: `"x-large"` → `"X Large"`. It is the
  single JS statement of the label rule; the macro applies the same
  rule in template syntax (a Nunjucks macro cannot call into the
  module, and delegating would force every consumer to register a
  custom filter), and a test holds the two in agreement.
- Required call: `initTextSizeChooser(rootElement, opts?)` or
  `autoInit(opts?)` to wire every `[data-lily-text-size-chooser-root]`
  on the page.

## Behaviour contract (one paragraph)

The macro emits a `<div class="text-size-chooser">` carrying
`data-lily-text-size-chooser-*` hooks describing the control's name,
storage key, default value, and — when `opts.value` is set — the
consumer's initial value (`data-lily-text-size-chooser-value`). Inside
it are a hidden input, an icon `<button>`, and a
`<ul role="listbox" hidden>`. On `initTextSizeChooser(root)`, the client
(1) resolves the initial slug from value attribute > storage >
default-value > `"medium"` > first-option, (2) sets
`data-text-size="{slug}"` on the resolved target (defaults to
`document.documentElement`), (3) optionally writes to `localStorage`,
(4) mirrors the slug into the hidden input and re-derives every
option's `aria-selected`, (5) calls `onChange(slug)`. The client ALSO
owns the entire listbox interaction: open/close, focus movement, the
APG keyboard contract, and typeahead. There is NO managed `<link>`, NO
`lang`/`dir`, and NO system detection.

## HTML

```html
<div class="text-size-chooser {classes}" data-lily-text-size-chooser-root …>
  <input type="hidden" name="{name}" value="{selected}"
         data-lily-text-size-chooser-input>
  <button type="button" class="text-size-chooser-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{id}-list"
          data-lily-text-size-chooser-button>
    <span class="text-size-chooser-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-chooser-list" id="{id}-list" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      data-lily-text-size-chooser-list>
    <li class="text-size-chooser-option" id="{id}-option-{i}" role="option"
        aria-selected="true|false" data-value="{slug}">{labelFor(slug)}</li>
  </ul>
</div>
```

The glyph is U+0041 LATIN CAPITAL LETTER A, `aria-hidden`. A plain
letter rather than a pictograph, deliberately: U+1F5DB DECREASE FONT
SIZE SYMBOL has no real glyph in common font stacks and means
*decrease* rather than *size*. A `{% call %}` block body replaces the
glyph inside the button (the Nunjucks equivalent of `children`); it
does not render options.

Server markup marks exactly ONE option `aria-selected="true"`,
resolved as `value or defaultValue or ("medium" if present else
sizes[0])`, and pre-fills the hidden input with it. The listbox is
rendered `hidden` with no `aria-activedescendant` and no `data-active`
— those are client-owned open-state concerns. `opts.value` travels
ONLY on `data-lily-text-size-chooser-value`.

Ids are `{id}-list` / `{id}-option-{i}` where `id` defaults to
`text-size-chooser-{name}`. Deterministic and SSR-safe; two instances
sharing a `name` need an explicit distinct `id`.

There is **no** `detectFromSystem` param — the web platform exposes no
OS "preferred text size" signal — and **no** `placeholder` param.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- Directly supports WCAG 1.4.4 (Resize Text) — this helper's specific
  concern.
- The client provides Arrow / Home / End / Enter / Space / Escape /
  Tab / typeahead semantics; none of it works before the client runs.
- `aria-label` is the ONLY accessible name the button has, since the
  glyph is `aria-hidden`.
- `aria-selected` tracks the applied size; `data-active` tracks the
  keyboard cursor. They are different things.
- Known tradeoffs, documented honestly in `docs/accessibility.md`: an
  icon-only control depends entirely on `aria-label`; a custom listbox
  has weaker AT support than a native `<select>`, which remains the
  better choice for some audiences; the glyph is font-dependent
  (though "A" is materially safer than a pictograph).
- **No-JS regression**: the button cannot be operated at all without
  the client module, which the native `<select>` could. Stated plainly
  in `docs/ssr.md`. This deserves extra weight here, since the users
  who most need a text-size control overlap with users on constrained
  setups.
- Option labels default to title-cased slugs.

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency on the client side beyond standard DOM APIs.
- No bundled CSS, fonts, icons, or images — including no positioning
  CSS for the open listbox.
- All user-facing strings come from `opts`.
- No inline `<script>` in the macro output; the client.js is loaded
  separately by the consumer.
