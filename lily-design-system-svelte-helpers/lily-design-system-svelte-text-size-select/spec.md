# TextSizeSelect — Specification (Svelte helper)

Canonical contract for `lily-design-system-svelte-text-size-select`.
The other framework catalogs (react, vue, angular, blazor, html,
nunjucks) port this spec one-to-one.

## 1. Purpose

A headless control that lets a user pick a text size and have the app
remember it. The component owns DOM application + persistence; the
consumer owns the actual typography via CSS keyed on
`[data-text-size="{slug}"]`.

## 2. Scope

In scope: rendering a native `<select>`, resolving the initial value,
writing `data-text-size` to a target, persistence, change events.
Out of scope: the CSS that maps a slug to a `font-size`/scale, picking
default sizes, or any visual styling.

## 3. HTML

`<select class="text-size-select {class}" aria-label="{label}"
name="{name}">` containing one `<option class="text-size-select-option"
value="{slug}">{label}</option>` per slug. A `children` snippet may
replace the default option rendering.

## 4. Props

| Prop          | Type                     | Required | Default       |
| ------------- | ------------------------ | -------- | ------------- |
| `label`       | `string`                 | yes      | —             |
| `sizes`       | `string[]`               | yes      | —             |
| `value`       | `string`                 | no       | `""`          |
| `defaultValue`| `string`                 | no       | —             |
| `storageKey`  | `string`                 | no       | —             |
| `name`        | `string`                 | no       | `"text-size"` |
| `target`      | `HTMLElement \| null`    | no       | `<html>`      |
| `sizeLabels`  | `Record<string,string>`  | no       | `{}`          |
| `onChange`    | `(size: string) => void` | no       | —             |
| `class`       | `string`                 | no       | `""`          |

## 5. Behaviour

On apply: set `data-text-size="{slug}"` on `target`; if `storageKey`,
write to `localStorage`; call `onChange(slug)`. Initial value resolves
`value` > storage > `defaultValue` > `"medium"` (if present) >
`sizes[0]`. SSR-safe (DOM writes guarded / inside effects).

`labelFor(slug)` returns `sizeLabels[slug]` if present, else the slug
title-cased per hyphen-word (`x-large` → `X Large`). The word
"default" is never emitted.

## 6. Accessibility

WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text). Native
`<select>` keyboard semantics; `aria-label` from `label`.

## 7. Acceptance criteria

- §7.1 Renders a `<select>` (implicit `combobox`).
- §7.2 `aria-label` equals `label`.
- §7.3 One `<option>` per size; `<select>` carries `name`.
- §7.4 Each option's value is its slug.
- §7.5 Default labels title-case the slug; `sizeLabels` overrides.
- §7.6 Initial value defaults to `"medium"` if present, else `sizes[0]`.
- §7.7 Applies `data-text-size` to `document.documentElement`.
- §7.8 Selecting an option updates `data-text-size` and fires `onChange`.
- §7.9 Persists to `localStorage` and re-reads on a fresh mount.
- §7.10 An explicit `value` wins over storage and defaults.
- §7.12 Extra attributes spread onto the `<select>`.
- §7.13 Custom `children` rendering receives the size context.
