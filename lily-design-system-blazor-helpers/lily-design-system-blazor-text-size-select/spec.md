# TextSizeSelect — Specification (Blazor)

Single source of truth for the
`lily-design-system-blazor-text-size-select` Blazor helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

This is a one-to-one port of the canonical Svelte helper
`lily-design-system-svelte-text-size-select`; when the two disagree,
the Svelte side wins and the Blazor side is patched.

Sibling files in this directory:

- `TextSizeSelect.razor` — Razor markup
- `TextSizeSelect.razor.cs` — C# code-behind (partial class)
- `TextSizeSelectTests.cs` — bUnit + xUnit spec exercising every clause in §4–§7
- `index.md` — user-facing readme

The Blazor headless library does not include a canonical
`TextSizeSelect`; this helper is the opinionated, reusable counterpart
that owns the text-size-application lifecycle (the `data-text-size`
attribute on the document root) and the persistence choice.

---

## 1. Goal

Give a Blazor application a drop-in, headless text-size select that:

1. Renders an accessible `<select>` of available text-size slugs.
2. **Applies the chosen size** by setting `data-text-size="{slug}"` on
   the document root.
3. Optionally persists the chosen size to `localStorage` so the choice
   survives reload.
4. Ships zero CSS — the consumer styles every visual aspect via the
   `text-size-select` class hook and maps each
   `[data-text-size="{slug}"]` to real typography.

## 2. Non-goals

- **Typography**. This component does not declare `font-size` or a
  type scale. It only signals the chosen slug via `data-text-size`,
  the `OnChange` callback, and the bindable `Value`. The CSS that maps
  a slug to a size is the consumer's job.
- **Picking default sizes**. The consumer always supplies the list of
  available size slugs.
- **`lang` / `dir`**. Out of scope here — see `LocaleSelect`.
- **A `<link>` swap**. No managed stylesheet element is created.

## 3. Architectural decisions

- **`data-text-size` on the document root is the source of truth.**
  Consumer CSS keys off `[data-text-size="{slug}"]`.
- **`IJSRuntime` for all DOM writes.** The `data-text-size` attribute
  is set via `IJSRuntime.InvokeVoidAsync("eval", …)`.
- **SSR-safe**. No DOM access occurs before `OnAfterRenderAsync`.

## 4. Public API

### 4.1 Parameters

| Parameter             | Type                                     | Required | Default                                | Purpose |
| --------------------- | ---------------------------------------- | -------- | -------------------------------------- | ------- |
| `Label`               | `string`                                 | yes      | —                                      | Accessible name for the select. |
| `Sizes`               | `IReadOnlyList<string>`                  | yes      | —                                      | Available size slugs. |
| `Value`               | `string`                                 | no       | `""`                                   | Currently selected size slug. Two-way bindable via `@bind-Value`. |
| `ValueChanged`        | `EventCallback<string>`                  | no       | —                                      | Two-way binding callback. |
| `DefaultValue`        | `string?`                                | no       | `"medium"` if present, else `Sizes[0]` | Initial size when nothing else is supplied. |
| `StorageKey`          | `string?`                                | no       | `null`                                 | If set, persist selection to `localStorage`. |
| `Name`                | `string`                                 | no       | `"text-size"`                          | `name` set on the `<select>`. |
| `SizeLabels`          | `IReadOnlyDictionary<string,string>`     | no       | empty                                  | Optional pretty labels per size slug. |
| `ChildContent`        | `RenderFragment<TextSizeSelectContext>?` | no       | default option markup                  | Custom rendering of the options. |
| `OnChange`            | `EventCallback<string>`                  | no       | —                                      | Fires after the select applies a new size. |
| `CssClass`            | `string`                                 | no       | `""`                                   | Extra CSS class merged into the `<select>` root. |
| `AdditionalAttributes`| `Dictionary<string,object>?`             | no       | —                                      | Captures unmatched attributes; spread onto the root. |

### 4.2 `TextSizeSelectContext`

```csharp
public sealed class TextSizeSelectContext
{
    public required IReadOnlyList<string> Sizes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetSize { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

### 4.3 DOM contract

- Root element: `<select class="text-size-select {CssClass}"
  aria-label="{Label}" name="{Name}">`.
- Default children: one `<option class="text-size-select-option"
  value="{slug}">{LabelFor(slug)}</option>` per size slug.
- `data-text-size="{slug}"` is set on `document.documentElement` via
  JS interop on every apply.

## 5. Behaviour

### 5.1 Initial value resolution

On first `OnAfterRenderAsync(firstRender: true)`, the initial size is
the first non-empty value of:

1. `Value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(StorageKey)` (only if `StorageKey` is set).
3. `DefaultValue`.
4. `"medium"` if present in `Sizes`, else `Sizes[0]`.
5. `""` (no apply happens — the select waits for user interaction).

### 5.2 Labels

`LabelFor(slug)` returns `SizeLabels[slug]` if present, else the slug
title-cased per hyphen-word (`x-large` → `X Large`). The word
"default" is never emitted.

### 5.3 Applying a size

Applying a size `slug` performs, in order:

1. Set `data-text-size="{slug}"` on `document.documentElement`.
2. If `StorageKey` is set, write `slug` to `localStorage` inside a
   try/catch.
3. Invoke `OnChange` and `ValueChanged` with the chosen slug.

### 5.4 Prerender / SSR

During static SSR or Blazor Server prerender, no JS interop is
attempted and no DOM is touched.

## 6. Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text).
- `<select>` has the browser's implicit `role="combobox"`.
- `aria-label={Label}` supplies the accessible name.
- The native `<select>` provides Arrow / Home / End / typeahead.

## 7. Testing acceptance criteria

`TextSizeSelectTests.cs` must assert every numbered item below. Tests
run under bUnit + xUnit.

1. §7.1 — Renders a `<select>` (implicit `combobox`), with the
   `text-size-select` class hook and no `role` attribute.
2. §7.2 — `aria-label` equals `Label`.
3. §7.3 — One `<option>` per size; the `<select>` carries `Name`
   (default `"text-size"`).
4. §7.4 — Each option's `value` is its slug.
5. §7.5 — Default labels title-case the slug; `SizeLabels` overrides;
   the `"default"` word is dropped.
6. §7.6 — Initial value defaults to `"medium"` if present, else
   `Sizes[0]`.
7. §7.7 — Applies `data-text-size` to `document.documentElement` after
   first render; `BuildApplyScript` embeds the slug.
8. §7.8 — Selecting an option updates `Value`, fires `OnChange` /
   `ValueChanged`, and invokes interop with the new slug.
9. §7.9 — When `StorageKey` is set, the apply-script writes to
   `localStorage`.
10. §7.10 — An explicit `Value` wins over storage and defaults.
11. §7.12 — Extra attributes captured by `AdditionalAttributes` spread
    onto the `<select>`.
12. §7.13 — A custom `ChildContent` renders custom `<option>` elements
    and receives `TextSizeSelectContext` with `Sizes`, `Name`, and
    `LabelFor` exposed.

## 8. Out-of-scope (future, not implemented here)

- A complementary `TextSizeView` helper.
- A `TextSizeSelect` sibling defaulting to radio-group markup.

## 9. Tracking

- Package directory:
  `lily-design-system-blazor-helpers/lily-design-system-blazor-text-size-select/`
- Spec version: 0.1.0
- Created: 2026-06-17
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical contract:
  [`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec.md`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec.md)
