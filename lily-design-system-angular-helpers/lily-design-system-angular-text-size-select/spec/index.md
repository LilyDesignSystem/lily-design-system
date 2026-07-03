# TextSizeSelect — Specification

Single source of truth for the
`lily-design-system-angular-text-size-select` Angular helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

This is the Angular port of the canonical Svelte contract in
[`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md).
When the Angular port and the Svelte canonical disagree, the Svelte
side wins and the Angular side is patched.

Sibling files in this directory:

- `text-size-select.component.ts` — the implementation
- `text-size-select.component.spec.ts` — vitest spec exercising every clause in §4–§7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

---

## 1. Goal

Give an Angular 20 application a drop-in, headless text-size select
that:

1. Renders an accessible native `<select>` of available size slugs.
2. **Applies the chosen size** by setting `data-text-size="{slug}"`
   on the document root (or on a consumer-supplied target).
3. Optionally persists the chosen size to `localStorage` so the
   choice survives reload.
4. Ships zero CSS — the consumer maps each `[data-text-size="…"]`
   slug to real typography via CSS targeting the `text-size-select`
   class hook.

## 2. Non-goals

- **Typography**. This component does not set `font-size` or any
  scale; the consumer owns the CSS keyed on `[data-text-size]`.
- **Picking the default size set**. The consumer always supplies the
  `sizes` array.
- **Custom default rendering**. The default is a native `<select>`
  for symmetry with the sibling helpers. Consumers who want a
  different widget bind it to the same `[(value)]` signal.

## 3. Architectural decisions

- **Standalone signal-based component.** Uses `input<T>()`,
  `input.required<T>()`, `output<T>()`, and `model<string>()`.
- **`OnPush` change detection.**
- **`data-text-size` is the wire format.** Slugs are written verbatim.
- **TypeScript strict** on the public surface.
- **SSR-safe.** DOM side-effects guard on `typeof document`.
- **No dependencies beyond `@angular/core` / `@angular/common`.**
- **Template-cast pattern**: `$any($event.target).value` (not the
  parenthesised TS-cast form, which Angular's template parser
  rejects).

## 4. Public API

### 4.1 Inputs / outputs

| Input / output | Type                           | Required | Default                               | Purpose |
| -------------- | ------------------------------ | -------- | ------------------------------------- | ------- |
| `label`        | `input.required<string>()`     | yes      | —                                     | Accessible name for the `<select>`. |
| `sizes`        | `input.required<string[]>()`   | yes      | —                                     | Available size slugs. |
| `value`        | `model<string>()`              | no       | `""`                                  | Currently selected size slug. Two-way bindable. |
| `defaultValue` | `input<string>()`              | no       | `""`                                  | Initial size when nothing else is supplied. |
| `storageKey`   | `input<string>()`              | no       | `""`                                  | If non-empty, persist the selection to `localStorage` under this key. |
| `name`         | `input<string>()`              | no       | `"text-size"`                         | `name` attribute of the `<select>`. |
| `target`       | `input<HTMLElement \| null>()` | no       | `null` (→ `document.documentElement`) | Element that receives `data-text-size`. |
| `sizeLabels`   | `input<Record<string,string>>()` | no     | `{}`                                  | Optional pretty labels per size slug. |
| `className`    | `input<string>()`              | no       | `""`                                  | Extra CSS class on the `<select>` root. |
| `sizeChange`   | `output<string>()`             | no       | —                                     | Emits after the select applies a new size. |

### 4.2 DOM contract

- Root element: `<select class="text-size-select {className}"
  [attr.aria-label]="label" [name]="name">`.
- Default children: one `<option class="text-size-select-option"
  [value]="size">{{ labelFor(size) }}</option>` per size slug.
- `data-text-size="{slug}"` is set on the `target` element on every
  apply.

### 4.3 Re-exports

`index.ts` exports `TextSizeSelect` (the component class).

## 5. Behaviour

### 5.1 Initial value resolution

On first effect run in the browser, the initial size is the first
non-empty value of:

1. `value()` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(storageKey)` (only if `storageKey` is set
   and the read does not throw).
3. `defaultValue`.
4. `"medium"` if present in `sizes`, else `sizes[0]`.
5. `""` (no apply happens).

### 5.2 Default labels

`labelFor(slug)` returns `sizeLabels[slug]` if present, else the slug
title-cased per hyphen-word (`x-large` → `X Large`).

### 5.3 Applying a size

Applying a size `slug` performs, in order:

1. Resolve the target element. If `target()` is null/undefined, use
   `document.documentElement`.
2. Set `target` attribute `data-text-size = slug`.
3. If `storageKey` is set, write `slug` to `localStorage` inside a
   try/catch.
4. Emit `sizeChange.emit(slug)`.

### 5.4 Reactivity

A single `effect()` re-applies the size whenever `value()` changes.

### 5.5 SSR

`effect()` runs but the `document`-guard prevents DOM mutation.

## 6. Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) and
  1.4.12 (Text Spacing) by letting users pick a comfortable reading
  size that the app remembers.
- `<select>` has an implicit `combobox` role and is the announced
  control. `[attr.aria-label]="label"` supplies the accessible name.
- The native `<select>` provides Arrow / Home / End / typeahead
  semantics for free.
- No user-facing strings are hardcoded inside the component.

## 7. Testing acceptance criteria

`text-size-select.component.spec.ts` must assert every numbered item
below. Tests run under vitest + jsdom + `@angular/core/testing`
`TestBed`.

### 7.1 Markup contract (mirrors §4.2)

1. Renders a `<select>` (implicit `combobox` role).
2. `aria-label` is the supplied `label`.
3. Renders one `<option>` per entry in `sizes`; the `<select>`
   carries the supplied `name` attribute.
4. Each option's `value` attribute is the size slug.
5. The default rendering title-cases the slug; `sizeLabels`
   overrides it.

### 7.2 Initial value (mirrors §5.1)

6. The initial value defaults to `"medium"` when present, else
   `sizes[0]`.
7. After mount, `data-text-size` is set on
   `document.documentElement`.

### 7.3 Size application (mirrors §5.3)

8. Selecting a different option updates `data-text-size` and emits
   `sizeChange` with the new slug.
9. A custom `target` element receives `data-text-size` instead of
   `document.documentElement`.

### 7.4 Initial-value resolution (mirrors §5.1)

10. When `storageKey` is set, the active slug is written to
    `localStorage` and read back on a fresh mount.
11. A supplied non-empty `value` input wins over storage and
    defaults.

### 7.5 Class hook

12. The consumer's `className` is appended to the root `<select>`
    class list.

## 8. Out-of-scope (future, not implemented here)

- A complementary `TextSizeView` helper.
- A `TextSizeSelect` sibling defaulting to radio-group markup.

## 9. Tracking

- Package directory: `lily-design-system-angular-helpers/lily-design-system-angular-text-size-select/`
- Spec version: 0.1.0
- Created: 2026-06-17
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical contract: [`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md)
