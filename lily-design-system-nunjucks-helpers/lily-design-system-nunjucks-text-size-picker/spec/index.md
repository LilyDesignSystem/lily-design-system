# TextSizeChooser — Specification (Nunjucks)

Single source of truth for the `lily-design-system-nunjucks-text-size-chooser`
Nunjucks helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `text-size-chooser.njk` — the macro implementation
- `text-size-chooser.client.js` — runtime JS that owns the lifecycle
  AND the listbox interaction
- `text-size-chooser.test.ts` — vitest spec exercising every clause in §4–§7
- `index.md` — user-facing readme
- `docs/` — topic deep-dives (`accessibility.md`, `ssr.md`)

The headless `lily-design-system-nunjucks-headless` library does not
(yet) include a canonical `TextSizeChooser`; this helper is the
opinionated, reusable counterpart split into a Nunjucks macro and a
client-side JS module. It is a direct port of the canonical Svelte
helper `lily-design-system-svelte-text-size-chooser`; the DOM contract
and behaviour match clause-for-clause, only the framework idioms
differ.

**BREAKING (Unreleased).** This helper no longer renders a native
`<select>`. It renders an icon `<button>` that opens a
`<ul role="listbox">`, matching `theme-chooser` and `locale-chooser`, so
all three helpers in the catalog are the same shape. See §3.1 for the
consequences, which include a real no-JS regression.

---

## 1. Goal

Give a Nunjucks-rendered application a drop-in, headless text-size
select that:

1. Renders an accessible icon button and listbox of available size
   slugs from a Nunjucks macro.
2. **Applies the chosen size** at runtime by setting
   `data-text-size="{slug}"` on the document root (or on a
   consumer-supplied target) via a companion client-side JS module.
3. Optionally persists the chosen size to `localStorage`.
4. Ships zero CSS — the consumer styles every visual aspect via the
   `text-size-chooser` class hooks and maps each
   `[data-text-size="{slug}"]` to a real typographic scale.

## 2. Non-goals

- **Typography.** This helper does not define the `font-size` /
  scale for any slug — only signals the chosen size via the
  `data-text-size` attribute, the `onChange` callback, and the hidden
  input's value.
- **Picking default sizes.** Consumers always supply the list of
  available size slugs.
- **System detection.** Deliberately absent. Unlike theme-chooser's
  `prefers-color-scheme` and locale-chooser's `navigator.languages`,
  the web platform exposes no OS "preferred text size" signal, so
  there is nothing to detect and no `detectFromSystem` prop.
- **Managed `<link>` / lang / dir.** Unlike the theme and locale
  helpers, this helper sets only a single `data-*` attribute. No
  stylesheet swap, no `lang`/`dir`.
- **Listbox positioning.** The package ships no CSS, including none
  for placing the open list. That is the consumer's job.
- **Inline `<script>` tags inside the macro output.** The client.js
  is a separate ES module loaded once per page.

## 3. Architectural decisions

- **Split between macro and client.js.** The macro renders static
  HTML with `data-lily-text-size-chooser-*` hooks; the client.js owns
  both the apply lifecycle (`data-text-size`, storage, `onChange`) and
  the entire listbox interaction (open/close, focus, keyboard,
  typeahead).
- **The `data-text-size` attribute is the source of truth.** The
  control writes there; consumer CSS keys typography off it.
- **Single `opts` object on the macro** — matches the Lily Nunjucks
  convention.
- **Vanilla ES module client.js** — no framework dependency. Exports
  `initTextSizeChooser(root, opts?)`, `autoInit(opts?)`, `sizeName`,
  and `LATIN_CAPITAL_LETTER_A`.
- **SSR-safe.** Macro is a pure template; client.js guards every DOM
  read/write.
- **Deterministic ids via the `id` opt.** A Nunjucks macro cannot hold
  an incrementing module counter the way the canonical Svelte helper
  does, so `id` (default `text-size-chooser-{name}`) is this
  framework's stable-id mechanism. No `Math.random`, no `Date.now`.
- **`sizeName` is restated, not delegated.** A Nunjucks macro cannot
  call into an ES module, and exposing it as a filter would force
  every consumer to register it on their environment. The macro
  therefore restates the title-case rule in template syntax and a test
  holds the two in agreement — the same decision `theme-chooser` and
  `locale-chooser` took for `themeName` / `localeName`.

### 3.1 The glyph, and what the conversion costs

The button glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A), not a
pictograph. U+1F5DB DECREASE FONT SIZE SYMBOL was the first choice but
has no real glyph in common font stacks — it degrades to a crude
bitmap shape — and it means *decrease* rather than *size*. "A" renders
in the page's own font everywhere, stays monochrome like theme-chooser's
◑, and is the conventional text-size affordance.

The conversion costs three things, none of which is a bug to be fixed
later. They are documented honestly in `docs/accessibility.md` and
`docs/ssr.md`:

1. The accessible name rests entirely on `opts.label`.
2. A hand-rolled listbox has weaker assistive-technology support than
   a native `<select>`; a native `<select>` remains the better choice
   for some audiences.
3. The glyph is font-dependent — though "A" is materially safer here
   than a pictograph would be.

And one regression: **without JavaScript the button cannot be operated
at all**, which the native `<select>` could. This deserves extra
weight in this particular helper, whose whole purpose is WCAG 1.4.4
(Resize Text).

## 4. Public API

### 4.1 Macro parameters

`{% from "./text-size-chooser.njk" import textSizeChooser %}` then
`{{ textSizeChooser(opts) }}`.

| Key            | Type                       | Required | Default       | Purpose |
| -------------- | -------------------------- | -------- | ------------- | ------- |
| `label`        | `string`                   | yes      | —             | Accessible name for the button AND the listbox (`aria-label` on both). The button is icon-only, so this is its ONLY accessible name. |
| `sizes`        | `array<string>`            | yes      | —             | Available size slugs (e.g. `["small", "medium", "large", "x-large"]`). |
| `value`        | `string`                   | no       | `""`          | Initial slug. Emitted as `data-lily-text-size-chooser-value` for the client to read. |
| `defaultValue` | `string`                   | no       | `""`          | Initial slug when nothing else is supplied at runtime. |
| `storageKey`   | `string`                   | no       | `""`          | If non-empty, the client.js persists to `localStorage`. |
| `name`         | `string`                   | no       | `"text-size"` | Hidden-input `name` attribute. |
| `sizeLabels`   | `object<string,string>`    | no       | `{}`          | Optional pretty labels per slug. |
| `id`           | `string`                   | no       | `"text-size-chooser-{name}"` | Id prefix for the listbox and its options. Supply an explicit id when two instances share a `name`. |
| `classes`      | `string`                   | no       | `""`          | Extra CSS classes on the root `<div>`. |
| `attributes`   | `object`                   | no       | —             | Extra HTML attributes spread onto the root. |

There is **no** `detectFromSystem` param (§2) and **no** `placeholder`
param (this helper never had one).

The `{% call %}` block body replaces the button's **glyph** — the
Nunjucks equivalent of the canonical helper's `children`. It does not
render options.

### 4.2 DOM contract (macro output)

```html
<div class="text-size-chooser {classes}" data-lily-text-size-chooser-root
     data-lily-text-size-chooser-name="{name}"
     data-lily-text-size-chooser-storage-key="{storageKey}"
     data-lily-text-size-chooser-default-value="{defaultValue}"
     [data-lily-text-size-chooser-value="{value}"] …{attributes}>
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
    <li class="text-size-chooser-option" id="{id}-option-{i}"
        role="option" aria-selected="true|false"
        data-value="{slug}">{labelFor(slug)}</li>
  </ul>
</div>
```

- `labelFor(slug)` is `sizeLabels[slug]` when present, else the slug
  title-cased per hyphen-word (`x-large` → `X Large`).
- Server markup marks exactly ONE option `aria-selected="true"`,
  resolved as `value or defaultValue or ("medium" if present else
  sizes[0])`, and pre-fills the hidden input with it.
- The listbox renders `hidden`, with no `aria-activedescendant` and no
  `data-active` — those are client-owned open-state concerns.
- `data-lily-text-size-chooser-value` is emitted only when `opts.value`
  is set, and is the sole channel by which `opts.value` reaches the
  client.

### 4.3 Client.js exports

`text-size-chooser.client.js` is an ES module exporting:

| Export                            | Type                                           | Purpose |
| --------------------------------- | ---------------------------------------------- | ------- |
| `initTextSizeChooser(root, opts?)` | `(HTMLElement, object?) => {setSize, destroy}` | Wire one root. |
| `autoInit(opts?)`                 | `(object?) => Array<{setSize, destroy}>`       | Wire every root on the page. |
| `sizeName(slug)`                  | `(string) => string`                           | Title-case a slug per hyphen-word. Mirrors `themeName` / `localeName`. |
| `LATIN_CAPITAL_LETTER_A`          | `string`                                       | The default button glyph, `"A"`. |

Optional `opts` for `initTextSizeChooser` / `autoInit`:

- `onChange(size)` — fired after every apply; receives the slug.
- `target` — element receiving `data-text-size` (defaults to
  `document.documentElement`).

## 5. Behaviour

### 5.1 Initial value resolution (client-side, on `initTextSizeChooser`)

The initial slug is the first non-empty value of:

1. `data-lily-text-size-chooser-value` (the consumer's `value` prop).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `data-lily-text-size-chooser-default-value`.
4. `"medium"` if present among the rendered option values.
5. The first option value, or `""` if none.

Unchanged by the icon-button release: `value` already beat storage
here, so unlike theme-chooser there is no precedence reversal and no
migration warning.

### 5.2 Applying a size

Applying a size `slug` performs, in order:

1. Resolve the target element (defaults to `document.documentElement`).
2. Set `target.setAttribute("data-text-size", slug)`.
3. If `storageKey` is non-empty, write `slug` to `localStorage`.
4. Mirror `slug` into the hidden input's `value`.
5. Re-derive every option's `aria-selected` against `slug`.
6. Call `opts.onChange?.(slug)` if supplied.

### 5.3 Listbox interaction (client-owned)

Follows the WAI-ARIA APG listbox pattern, identical to `theme-chooser`
and `locale-chooser`.

On the **button**:

| Key                           | Action |
| ----------------------------- | ------ |
| `ArrowDown`, `Enter`, `Space` | Open with the selected size active; focus moves to the list. |
| `ArrowUp`                     | Open with the LAST option active. |

On the **listbox**:

| Key                     | Action |
| ----------------------- | ------ |
| `ArrowDown` / `ArrowUp` | Move the active option. Clamps at the ends; no wrapping. |
| `Home` / `End`          | Jump to the first / last option. |
| `Enter` / `Space`       | Select the active option, apply it, close, return focus to the button. |
| `Escape`                | Close and return focus, leaving the size unchanged. |
| `Tab`                   | Close without stealing focus back. |
| Printable character     | Typeahead over the option labels; 500 ms buffer reset. Matches the rendered label, so `sizeLabels` overrides participate. |

Clicking an option selects it. Clicking outside the root, or moving
focus out of it, closes the listbox without changing the size.

DOM focus stays on the `<ul>`; the cursor is conveyed by
`aria-activedescendant` and mirrored onto the active option as
`data-active`. `aria-selected` tracks the **applied** size — a
different thing from the cursor.

### 5.4 Default labels (macro side)

When `sizeLabels[slug]` is missing, the macro falls back to the slug
title-cased per hyphen-word, via `{{ slug | replace(r/-/g, " ") | title }}`
(`x-large` → `X Large`). This is the same rule `sizeName(slug)` states
in JS; see §3. The client.js does NOT overwrite labels at runtime —
pretty labels are a macro concern.

### 5.5 SSR

Macro renders deterministic markup; no DOM access at template time.
Client.js touches `document` only after `initTextSizeChooser(root)` is
called. See `docs/ssr.md`, including the no-JS regression.

## 6. Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- Directly supports WCAG 1.4.4 (Resize Text) by letting the user pick
  a larger typographic scale — this helper's specific concern.
- `aria-label` is the ONLY accessible name the button has, since the
  glyph is `aria-hidden="true"`.
- The client provides Arrow / Home / End / Enter / Space / Escape /
  Tab / typeahead semantics; none of it works before the client runs.
- Known tradeoffs and the no-JS regression are documented honestly in
  `docs/accessibility.md` and `docs/ssr.md` rather than being claimed
  away.

## 7. Testing acceptance criteria

`text-size-chooser.test.ts` asserts the numbered items below. Tests run
under vitest + jsdom. The macro half renders via
`nunjucks.renderString`; the client.js half mounts that HTML into the
jsdom document and exercises the runtime. Clause numbers are kept
parallel with `theme-chooser`'s spec so the two read side by side.

### 7.1 Markup contract (macro)

1. **§7.1** Macro renders a `<div>` root containing a `<button>`
   (`type="button"`, `aria-haspopup="listbox"`,
   `aria-expanded="false"`, `aria-controls` → the list id) that
   controls a `<ul role="listbox" tabindex="-1">`; the button renders
   the `"A"` glyph in an `aria-hidden` span, and the glyph is never
   the accessible name.
2. **§7.2** `aria-label` names both the button and the listbox.
3. **§7.3** One `<li role="option">` per size; the hidden input
   carries the supplied `name`, defaulting to `"text-size"`.
4. **§7.4** Each option carries the slug on `data-value` and a stable,
   unique, deterministic id; an explicit `id` namespaces the listbox
   and its options.
5. **§7.5** Default labels title-case the slug per hyphen-word.
6. **§7.6** `sizeLabels` override the default label; unmapped slugs
   still fall back to the title-cased slug.

### 7.2 Client.js lifecycle

7. **§7.7** Initial apply sets `data-text-size` on
   `document.documentElement`.
8. **§7.8** A custom `target` receives `data-text-size` instead.
9. **§7.9** Choosing an option updates `data-text-size` and the hidden
   input, and fires `onChange`.
10. **§7.10** `setSize` applies a size programmatically.
11. **§7.11** `autoInit()` wires every
    `[data-lily-text-size-chooser-root]` on the page, and distinct
    `name`s yield distinct listbox ids.
12. **§7.12** Init is a safe no-op on a root missing its button and
    list.
13. **§7.13** Extra `attributes` spread onto the root `<div>`;
    `classes` append to the base class hook; `destroy()` detaches the
    listeners.

### 7.3 Server-rendered listbox state

14. **§7.14** The listbox renders `hidden` and the button collapsed,
    with no `aria-activedescendant` and no `data-active`, before any
    JS runs.
15. **§7.15** Exactly one option is `aria-selected="true"` in the
    server markup, and every other option is explicitly `"false"`. It
    is `opts.value` when supplied, else `defaultValue`, else
    `"medium"` if present, else the first size.
16. **§7.16** The hidden input is pre-filled server-side so a no-JS
    form submit still carries a size.

### 7.4 The `value` channel and the glyph override

17. **§7.17** `opts.value` is carried on
    `data-lily-text-size-chooser-value` and resolves the initial size.
18. **§7.18** That data attribute is omitted entirely when `opts.value`
    is unset.
19. **§7.19** A `{% call %}` block replaces the glyph inside the
    button, and the accessible name still comes from `aria-label`.

### 7.5 Keyboard contract (APG listbox)

20. **§7.20** `ArrowDown`, `Enter` and `Space` open the listbox and
    move focus to it; `ArrowUp` opens with the last option active.
21. **§7.21** Opening puts the active descendant on the selected size;
    `ArrowDown` / `ArrowUp` move it and clamp at both ends rather than
    wrapping; `Home` / `End` jump to the first / last option.
22. **§7.22** `Enter` selects the active option, applies it, closes,
    and returns focus to the button; `Space` does the same.
23. **§7.23** `Escape` closes and returns focus without changing the
    size; `Tab` closes without stealing focus back.
24. **§7.24** Printable characters run typeahead over the rendered
    labels (so `sizeLabels` overrides participate), the buffer
    accumulates and resets after 500 ms, and modifier chords are
    excluded. Clicking an option selects it; clicking the button
    toggles; clicking outside or moving focus out closes.
    `aria-selected` follows the applied size, not merely the active
    option.

### 7.6 Pure helpers

25. **§7.25** `sizeName` title-cases each hyphen-separated word, and
    is the JS statement of the rule the macro renders — held in
    agreement by a test rather than by delegation.

### 7.7 Initial-value resolution

26. **§7.26** The initial size defaults to `"medium"` when present,
    else `sizes[0]`.
27. **§7.27** When `storageKey` is set, the active slug is written to
    `localStorage` and read back on a fresh init.
28. **§7.28** The full order is
    `value > storage > defaultValue > "medium" > sizes[0]`; `value`
    beats a conflicting storage entry, and storage still applies when
    `value` is absent.

## 8. Out-of-scope (future)

- A complementary `TextSizeView` helper.
- A built-in default-size table.
- A no-JS fallback rendering mode.

## 9. Tracking

- Package directory:
  `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-text-size-chooser/`
- Spec version: 0.2.0 (unreleased — the icon-button conversion)
- Created: 2026-06-17
- Updated: 2026-07-20
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical reference: the Svelte helper
  `lily-design-system-svelte-text-size-chooser`

---

Lily™ and Lily Design System™ are trademarks.
