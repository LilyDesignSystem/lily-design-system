# TextSizeSelect — Specification (React helper)

Port of the canonical Svelte contract
([`../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec.md`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec.md)).
The §7 numbering matches the Svelte spec so cross-framework tests line up.

## 1. Purpose

A headless control that lets a user pick a text size and have the app
remember it. The component owns DOM application + persistence; the
consumer owns the actual typography via CSS keyed on
`[data-text-size="{slug}"]`.

## 2. Scope

In scope: rendering a native `<select>`, resolving the initial value,
writing `data-text-size` to a target, persistence, change events.
Out of scope: the CSS that maps a slug to a `font-size`/scale, picking
default sizes, or any visual styling. There is no themesUrl/extension,
no managed `<link>`, and no locale/lang/dir logic — this helper sets
one data attribute only.

## 3. HTML

`<select className="text-size-select {className}" aria-label="{label}"
name="{name}">` containing one `<option className="text-size-select-option"
value="{slug}">{label}</option>` per slug. A `children` render prop may
replace the default option rendering.

## 4. Public API

### 4.1 Props

| Prop          | Type                          | Required | Default       |
| ------------- | ----------------------------- | -------- | ------------- |
| `label`       | `string`                      | yes      | —             |
| `sizes`       | `string[]`                    | yes      | —             |
| `value`       | `string`                      | no       | uncontrolled  |
| `defaultValue`| `string`                      | no       | —             |
| `storageKey`  | `string`                      | no       | —             |
| `name`        | `string`                      | no       | `"text-size"` |
| `target`      | `HTMLElement \| null`         | no       | `<html>`      |
| `sizeLabels`  | `Record<string,string>`       | no       | `{}`          |
| `children`    | `(args: ChildArgs) => Node`   | no       | —             |
| `onChange`    | `(size: string) => void`      | no       | —             |
| `className`   | `string`                      | no       | `""`          |

Remaining `<select>` attributes spread onto the root.

### 4.2 ChildArgs

`{ sizes, value, setSize, name, labelFor }`.

### 4.3 Exports

- Default + named: `TextSizeSelect`.
- Named helper: `titleCaseSize`.
- Types: `Props`, `ChildArgs`.

## 5. Behaviour

On apply: set `data-text-size="{slug}"` on `target ?? document.documentElement`;
if `storageKey`, write to `localStorage`; call `onChange(slug)`. Initial
value resolves `value` > storage > `defaultValue` > `"medium"` (if present)
> `sizes[0]`. SSR-safe — all DOM writes happen inside `useEffect`.

`labelFor(slug)` returns `sizeLabels[slug]` if present, else the slug
title-cased per hyphen-word (`x-large` → `X Large`). The word
"default" is never emitted.

Controlled when `value !== undefined`; otherwise uncontrolled with
internal `useState`.

## 6. Accessibility

WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text). Native
`<select>` keyboard semantics; `aria-label` from `label`.

## 7. Acceptance criteria

- §7.1 Renders a `<select>` (implicit `combobox`).
- §7.2 `aria-label` equals `label`.
- §7.3 One `<option>` per size; `<select>` carries `name` (default `"text-size"`).
- §7.4 Each option's value is its slug.
- §7.5 Default labels title-case the slug; `sizeLabels` overrides.
- §7.6 Initial value defaults to `"medium"` if present, else `sizes[0]`;
  `defaultValue` wins over that fallback.
- §7.7 Applies `data-text-size` to `document.documentElement` (or `target`).
- §7.8 Selecting an option updates `data-text-size` and fires `onChange`.
- §7.9 Persists to `localStorage` and re-reads on a fresh mount.
- §7.10 An explicit `value` wins over storage and defaults.
- §7.12 Extra attributes spread onto the `<select>`.
- §7.13 Custom `children` render prop receives the size context.
