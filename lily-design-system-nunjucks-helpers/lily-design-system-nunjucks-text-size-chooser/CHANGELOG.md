# Changelog — TextSizeChooser (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

First release under the name
`lily-design-system-nunjucks-text-size-chooser`. The package was renamed
from `lily-design-system-nunjucks-text-size-select`; because no release
has ever been published under the new name, the version restarts at
0.1.0 rather than continuing the old 0.2.0 line. The rename brings the
helper into line with its three siblings, all now `*-chooser`.

### The package as it stands

- **`text-size-chooser.njk`** — the `textSizeChooser(opts)` macro.
  Renders a `<div class="text-size-chooser">` root containing a hidden
  `<input>`, a glyph-only `<button class="text-size-chooser-button">`
  (U+0041), and a `<ul class="text-size-chooser-list" role="listbox"
  hidden>` of `<li class="text-size-chooser-option" role="option">`. Ids
  default to `text-size-chooser-{name}`.
- **`text-size-chooser.client.js`** — the runtime. Owns open/close,
  focus, the keyboard contract, `localStorage` persistence, and setting
  `data-text-size` on the document root. Exports `initTextSizeChooser`,
  `autoInit`, `sizeName`, and `LATIN_CAPITAL_LETTER_A`.
- **DOM hooks** — `data-lily-text-size-chooser-root`, `-name`,
  `-storage-key`, `-default-value`, `-value`, `-input`, `-button`,
  `-list`.
- **`text-size-chooser.test.ts`** — 52 vitest cases mapped onto the
  clauses of `spec/index.md`.

---

## Prior history — released in-tree as `lily-design-system-nunjucks-text-size-select`

The entries below record this package's development under its
former name. Nothing was ever published under the
`lily-design-system-nunjucks-text-size-chooser` name before 0.1.0 above,
so these version numbers do not describe releases of the current
package. They are kept because the DOM contract, keyboard
behaviour and breaking changes they describe are still the ones
in force.

### 0.2.0 — 2026-07-21

#### Changed (BREAKING — the control is no longer a `<select>`)

- **The macro no longer renders a native `<select>`.** It renders a
  `<div>` root containing a hidden `<input>`, a glyph-only `<button>`,
  and a `<ul role="listbox" hidden>` of `<li role="option">`. This
  matches `theme-chooser` and `locale-chooser`, which converted first, so
  all three helpers in the catalog are now the same shape.
- **The `name` opt now names the hidden input**, not the `<select>`.
  Its default is unchanged (`"text-size"`), and form participation is
  preserved: the input is pre-filled server-side and mirrored on every
  apply.
- **`opts.value` no longer renders as a `selected` option.** It travels
  on `data-lily-text-size-chooser-value` instead — the same out-of-band
  mechanism the sibling helpers use to avoid a pre-hydration flash. The
  macro still marks exactly one `<li>` `aria-selected="true"`.
- **Class hooks changed.** `.text-size-chooser` remains the root hook,
  but `.text-size-chooser-option` is now an `<li>`, not an `<option>`,
  and consumer CSS targeting `select.text-size-chooser` or
  `option.text-size-chooser-option` must be rewritten. New hooks below.
- **Consumers must load `text-size-chooser.client.js`.** Previously the
  macro alone produced a working control and the client.js only added
  the apply lifecycle. Now the client.js also owns open/close, focus,
  keyboard, and typeahead — without it the button is inert.

#### Added

- Class hooks: `.text-size-chooser-button`, `.text-size-chooser-icon`,
  `.text-size-chooser-list`, `.text-size-chooser-option`, plus
  `[data-active]` (keyboard cursor) and `[aria-selected]` (applied
  size) state hooks. The package ships no positioning CSS for the open
  listbox; that is the consumer's job.
- `id` macro opt, defaulting to `text-size-chooser-{name}`, giving
  deterministic SSR-safe ids for the listbox and its options. A
  Nunjucks macro cannot hold an incrementing module counter the way the
  canonical Svelte helper does, so this parameter is the framework's
  stable-id mechanism; two instances sharing a `name` need distinct
  `id`s.
- `{% call %}` block support: the block body replaces the button's
  glyph — the Nunjucks equivalent of the canonical helper's `children`.
  It does not render options.
- Full WAI-ARIA APG listbox keyboard contract in the client:
  `ArrowDown` / `ArrowUp` / `Enter` / `Space` open (ArrowUp starts on
  the last option), focus moves to the list, the cursor is
  `aria-activedescendant` mirrored to `data-active`, arrows clamp
  rather than wrap, `Home` / `End` jump, printable characters run
  typeahead over the rendered labels with a 500 ms buffer, `Enter` /
  `Space` select and return focus, `Escape` closes without changing the
  value, `Tab` closes and moves on. Click to select; click outside or
  focus-out closes.
- `sizeName(slug)` export — title-cases hyphen-separated words
  (`"x-large"` → `"X Large"`), mirroring theme-chooser's `themeName` and
  locale-chooser's `localeName`. The macro restates the same rule in
  template syntax rather than delegating: a Nunjucks macro cannot call
  into an ES module, and exposing it as a filter would force every
  consumer to register it on their environment. A test holds the two
  in agreement.
- `LATIN_CAPITAL_LETTER_A` export — the default button glyph, `"A"`.
- `docs/accessibility.md` and `docs/ssr.md`, plus
  `examples/01-basic.njk` demonstrating the control with its status
  region and a worked type scale.

#### Note on the glyph

The button glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A), not a
pictograph. U+1F5DB DECREASE FONT SIZE SYMBOL was the first choice but
has no real glyph in common font stacks — it degrades to a crude bitmap
shape — and it means *decrease* rather than *size*. "A" renders in the
page's own font everywhere, stays monochrome like theme-chooser's ◑, and
is the conventional text-size affordance. It is materially safer than a
pictograph against the "glyph may not render" tradeoff: if "A" does not
render, the page has no readable text at all.

#### Not added, deliberately

- **No detection prop.** Unlike theme-chooser's `prefers-color-scheme`
  and locale-chooser's `navigator.languages`, the web platform exposes
  no OS "preferred text size" signal, so there is nothing to detect.

#### Regression (documented, not fixed)

- **The control no longer works without JavaScript.** The button has no
  handler and the listbox renders `hidden`, so with JS disabled the
  user cannot change the text size. The native `<select>` it replaced
  was fully operable with no JS whatsoever. The pre-filled hidden input
  keeps form submission working but is not a choice path.
- This matters more here than in the sibling helpers. A text-size
  control exists to satisfy WCAG 1.4.4 (Resize Text), and the users who
  most need it overlap with the population most likely to be running
  without working JavaScript. `docs/ssr.md` and `docs/accessibility.md`
  both say so plainly, and note that browser zoom and the user's own
  default font size remain the backstop.

#### Unchanged

- `data-text-size` application, `localStorage` persistence, `onChange`,
  the `target` opt, and SSR safety.
- Initial-value resolution order:
  `value > storage > defaultValue > "medium" > sizes[0]`. Unlike
  theme-chooser, `value` already beat storage here, so there is no
  precedence reversal and no migration warning.
- Default option labels title-case the slug per hyphen-word;
  `sizeLabels` overrides. Typeahead now matches those rendered labels.
- Zero CSS, zero fonts, zero icons; every user-facing string comes from
  `opts`.

### 0.1.0 — 2026-07-03

Initial release: a native-`<select>` text-size helper that sets
`data-text-size` on the document root, with optional `localStorage`
persistence. Born select-based, so it carried no picker migration.

---

Lily™ and Lily Design System™ are trademarks.
