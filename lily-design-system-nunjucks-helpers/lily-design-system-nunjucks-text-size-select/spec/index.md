# TextSizeSelect — Specification (Nunjucks)

Single source of truth for the `lily-design-system-nunjucks-text-size-select`
Nunjucks helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `text-size-select.njk` — the macro implementation
- `text-size-select.client.js` — runtime JS that owns the lifecycle
- `text-size-select.test.ts` — vitest spec exercising every clause in §4–§7
- `index.md` — user-facing readme

The headless `lily-design-system-nunjucks-headless` library does not
(yet) include a canonical `TextSizeSelect`; this helper is the
opinionated, reusable counterpart split into a Nunjucks macro and a
client-side JS module. It is a direct port of the canonical Svelte
helper `lily-design-system-svelte-text-size-select`; the DOM contract
and behaviour match clause-for-clause, only the framework idioms
differ.

---

## 1. Goal

Give a Nunjucks-rendered application a drop-in, headless text-size
select that:

1. Renders an accessible native `<select>` of available size slugs
   from a Nunjucks macro.
2. **Applies the chosen size** at runtime by setting
   `data-text-size="{slug}"` on the document root (or on a
   consumer-supplied target) via a companion client-side JS module.
3. Optionally persists the chosen size to `localStorage`.
4. Ships zero CSS — the consumer styles every visual aspect via the
   `text-size-select` class hook and maps each
   `[data-text-size="{slug}"]` to a real typographic scale.

## 2. Non-goals

- **Typography.** This helper does not define the `font-size` /
  scale for any slug — only signals the chosen size via the
  `data-text-size` attribute, the `onChange` callback, and the
  `<select>`'s current value.
- **Picking default sizes.** Consumers always supply the list of
  available size slugs.
- **Managed `<link>` / lang / dir / navigator detection.** Unlike
  the locale helper, this helper sets only a single `data-*`
  attribute. No stylesheet swap, no `lang`/`dir`, no navigator
  inspection.
- **Custom default rendering.** The default is a native `<select>`
  with one `<option>` per slug. Consumers who want buttons or a
  combobox instead render their own markup and use the client.js
  helpers to wire it up — see `index.md`.
- **Inline `<script>` tags inside the macro output.** The client.js
  is a separate ES module loaded once per page.

## 3. Architectural decisions

- **Split between macro and client.js.** The macro renders static
  HTML with `data-lily-text-size-select-*` hooks; the client.js owns
  the apply lifecycle (data-text-size, storage, change events).
- **The `data-text-size` attribute is the source of truth.** The
  select writes there; consumer CSS keys typography off it.
- **Single `opts` object on the macro** — matches the Lily Nunjucks
  convention.
- **Vanilla ES module client.js** — no framework dependency. Exports
  `initTextSizeSelect(root, opts?)` and `autoInit(opts?)`.
- **SSR-safe.** Macro is a pure template; client.js guards every DOM
  read/write.

## 4. Public API

### 4.1 Macro parameters

`{% from "./text-size-select.njk" import textSizeSelect %}` then
`{{ textSizeSelect(opts) }}`.

| Key            | Type                       | Required | Default       | Purpose |
| -------------- | -------------------------- | -------- | ------------- | ------- |
| `label`        | `string`                   | yes      | —             | Accessible name for the `<select>` (`aria-label`). |
| `sizes`        | `array<string>`            | yes      | —             | Available size slugs (e.g. `["small", "medium", "large", "x-large"]`). |
| `value`        | `string`                   | no       | `""`          | Initial selected slug (rendered as the selected option). |
| `defaultValue` | `string`                   | no       | `""`          | Initial slug when nothing else is supplied at runtime. |
| `storageKey`   | `string`                   | no       | `""`          | If non-empty, the client.js persists to `localStorage`. |
| `name`         | `string`                   | no       | `"text-size"` | `<select>` `name` attribute. |
| `sizeLabels`   | `object<string,string>`    | no       | `{}`          | Optional pretty labels per slug. |
| `classes`      | `string`                   | no       | `""`          | Extra CSS classes on the `<select>` root. |
| `attributes`   | `object`                   | no       | —             | Extra HTML attributes spread onto the root. |

### 4.2 DOM contract (macro output)

- Root element: `<select class="text-size-select {classes}"
  aria-label="{label}" name="{name}"
  data-lily-text-size-select-root
  data-lily-text-size-select-name="{name}"
  data-lily-text-size-select-storage-key="{storageKey}"
  data-lily-text-size-select-default-value="{defaultValue}">`.
- One `<option class="text-size-select-option" value="{slug}"
  {selected when value===slug}>{labelFor(slug)}</option>` per slug.
- `labelFor(slug)` is `sizeLabels[slug]` when present, else the slug
  title-cased per hyphen-word (`x-large` → `X Large`).

### 4.3 Client.js exports

`text-size-select.client.js` is an ES module exporting:

| Export                          | Type                                            | Purpose |
| ------------------------------- | ----------------------------------------------- | ------- |
| `initTextSizeSelect(root, opts?)` | `(HTMLElement, object?) => {setSize, destroy}` | Wire one `<select>`. |
| `autoInit(opts?)`               | `(object?) => Array<{setSize, destroy}>`        | Wire every root on the page. |

Optional `opts`:

- `onChange(size)` — fired after every apply; receives the slug.
- `target` — element receiving `data-text-size` (defaults to
  `document.documentElement`).

## 5. Behaviour

### 5.1 Initial value resolution (client-side, on `initTextSizeSelect`)

The initial slug is the first non-empty value of:

1. The `value` of any `<option>` the macro rendered with `selected`
   (i.e. the consumer's `value` prop). Read via
   `Array.from(root.options).find(o => o.defaultSelected)` — NOT
   `root.value`, which reports the first option even when none is
   explicitly selected.
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. The `<select>`'s `data-lily-text-size-select-default-value`.
4. `"medium"` if present among the rendered option values.
5. The first option value, or `""` if none.

### 5.2 Applying a size

Applying a size `slug` performs, in order:

1. Resolve the target element (defaults to `document.documentElement`).
2. Set `target.setAttribute("data-text-size", slug)`.
3. If `storageKey` is non-empty, write `slug` to `localStorage`.
4. Set the `<select>` value so the matching option is selected.
5. Call `opts.onChange?.(slug)` if supplied.

### 5.3 Default labels (macro side)

When `sizeLabels[slug]` is missing, the macro falls back to the slug
title-cased per hyphen-word, via `{{ slug | replace(r/-/g, " ") | title }}`
(`x-large` → `X Large`). The client.js does NOT overwrite labels at
runtime — pretty labels are a macro concern.

### 5.4 SSR

Macro renders deterministic markup; no DOM access at template time.
Client.js touches `document` only after `initTextSizeSelect(root)` is
called.

## 6. Accessibility

- `<select aria-label="{label}">` is the announced combobox
  container.
- The native `<select>` provides Arrow / Home / End / typeahead /
  Tab semantics with no JS keyboard handlers.
- Directly supports WCAG 1.4.4 (Resize Text) by letting the user
  pick a larger typographic scale.
- WCAG 2.2 AAA is the target.

## 7. Testing acceptance criteria

`text-size-select.test.ts` must assert the numbered items below
(ported from the Svelte canonical §7). Tests run under vitest +
jsdom. The macro half renders via `nunjucks.renderString`; the
client.js half mounts that HTML into the jsdom document and exercises
the runtime.

### 7.1 Markup contract (macro)

1. Macro renders a `<select>` (implicit `role="combobox"`).
2. Macro renders `aria-label` equal to the supplied `label`.
3. Macro renders one `<option>` per entry in `sizes`, and the
   `<select>` carries the supplied `name` (default `"text-size"`).
4. Each `<option>`'s `value` attribute is the slug.
5. Default option labels title-case the slug per hyphen-word;
   `sizeLabels[slug]` overrides.

### 7.2 Client.js lifecycle

6. Initial value defaults to `"medium"` when present, else `sizes[0]`.
7. Init applies `data-text-size` to `document.documentElement`.
8. Selecting an option updates `data-text-size` and fires `onChange`;
   a custom `target` receives the attribute instead.

### 7.3 Initial-value resolution

9. When `storageKey` is set, the active slug is written to
   `localStorage` and read back on a fresh init.
10. When the macro renders a non-empty `value`, the initial-value
    resolution uses the supplied value (skipping storage and
    defaults).

### 7.4 Spread + autoInit

12. Extra attributes spread through onto the `<select>` root.
13. `autoInit()` wires every `[data-lily-text-size-select-root]` on
    the page.

## 8. Out-of-scope (future)

- A complementary `TextSizeView` helper.
- A built-in default-size table.

## 9. Tracking

- Package directory:
  `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-text-size-select/`
- Spec version: 0.1.0
- Created: 2026-06-17
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical reference: the Svelte helper
  `lily-design-system-svelte-text-size-select`
