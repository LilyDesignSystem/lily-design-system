# TextSizeSelect — Specification (Vue 3 helper)

Single source of truth for the `lily-design-system-vue-text-size-select`
Vue 3 helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

The canonical reference for this helper is the Svelte sibling at
`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/`.
This Vue port mirrors the contract and behaviour one-to-one, swapping
in Vue 3 idioms (Composition API, `defineProps`, `withDefaults`,
`defineEmits`, `ref`, `watch`, `onMounted`, scoped slot). When the
Vue port and the Svelte canonical disagree, the Svelte side wins.

Sibling files in this directory:

- `TextSizeSelect.vue` — the implementation
- `TextSizeSelect.test.ts` — vitest spec exercising every §7 clause
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

---

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
value="{slug}">{label}</option>` per slug. The default scoped slot may
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
| `class`       | `string`                 | no       | `""`          |

`value` is two-way bindable via `v-model:value`. Events: `update:value`
(drives the binding) and `change` (after a new size is applied).

## 5. Behaviour

On apply: set `data-text-size="{slug}"` on `target` (defaults to
`document.documentElement`); if `storageKey`, write to `localStorage`;
emit `change(slug)`. Initial value resolves `value` > storage >
`defaultValue` > `"medium"` (if present) > `sizes[0]`. SSR-safe — all
DOM writes happen inside `onMounted` / `watch`.

An internal `current` ref is the source of truth so the picker works
both controlled (consumer drives `v-model:value`) and uncontrolled
(no binding — the picker resolves and applies a default itself). A
`watch(() => props.value, …)` mirrors external changes into `current`;
a `watch(current, …)` applies.

`labelFor(slug)` returns `sizeLabels[slug]` if present, else the slug
title-cased per hyphen-word (`x-large` → `X Large`).

## 6. Accessibility

WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text). Native
`<select>` keyboard semantics (Arrow / Home / End / typeahead);
`aria-label` from `label`.

## 7. Acceptance criteria

- §7.1 Renders a `<select>` (implicit `combobox`).
- §7.2 `aria-label` equals `label`.
- §7.3 One `<option>` per size; `<select>` carries `name` (default `text-size`).
- §7.4 Each option's value is its slug.
- §7.5 Default labels title-case the slug; `sizeLabels` overrides.
- §7.6 Initial value defaults to `"medium"` if present, else `sizes[0]`; `defaultValue` wins over that fallback.
- §7.7 Applies `data-text-size` to `document.documentElement` (or `target`).
- §7.8 Selecting an option updates `data-text-size` and emits `change`.
- §7.9 Persists to `localStorage` and re-reads on a fresh mount.
- §7.10 An explicit `value` wins over storage and defaults.
- §7.12 Extra attributes spread onto the `<select>`.
- §7.13 Custom default-slot rendering receives the size context.
