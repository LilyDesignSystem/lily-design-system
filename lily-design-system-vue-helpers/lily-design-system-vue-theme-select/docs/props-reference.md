# Props reference

Field-by-field reference for every public prop. The contract is
owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on **both** the trigger `<button>` and the
`<ul role="listbox">`. Always supplied, always translatable.

The button is icon-only, so this is its *entire* accessible name —
there is no visible text to fall back to. A wrong, missing, or
untranslated `label` leaves the control announced as a bare "button".
Treat it as load-bearing copy and route it through the same
translation pipeline as the rest of your strings. See
[accessibility.md](./accessibility.md) for the full tradeoff.

> **Removed in the icon-button rewrite:** `placeholder`. It described
> the leading `<option>` of the old native `<select>`, and there is no
> `<select>` left to pin. Delete the prop from your usage; the
> `.theme-select-placeholder` class hook is gone too.

## `themesUrl` — required, string

Base URL of the directory the theme CSS files are served from. A
trailing `/` is appended automatically if missing, so both
`"/assets/themes/"` and `"/assets/themes"` work.

Acceptable values:

- Absolute path: `"/assets/themes/"` — recommended for in-app
  assets.
- Absolute URL: `"https://cdn.example.com/themes/"` — for
  CDN-hosted themes (CORS-permitting).
- Relative path: `"./themes/"` — works but depends on the current
  document base URL; not recommended for production.

## `themes` — required, string[]

The slugs of the themes the select exposes as options — one
`<li role="option">` per entry, in array order. The slug is used both
as the option's identity and as the URL path segment when constructing
the stylesheet href. Choose slugs that are safe URL path segments —
kebab-case ASCII is recommended.

Array order is the keyboard order: `ArrowDown` walks it forwards,
`Home` / `End` jump to `themes[0]` / the last entry, and `ArrowUp` on
the closed button opens with the last entry active.

## `value` — optional, string (v-model:value)

The active slug. Two-way bindable with `v-model:value` so the
surrounding code can read and write the selection.

When supplied as a non-empty string, the select treats it as the
authoritative initial value — `storageKey` and `defaultValue` are
both skipped on first mount.

```vue
<ThemeSelect v-model:value="theme" ... />
```

## `defaultValue` — optional, string

Used during initial-value resolution when `value` is empty and
nothing was stored. If `defaultValue` is itself empty, the resolver
falls back to `"light"` (when present in `themes`) and then to
`themes[0]`.

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the select:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the select continues to work in-memory.

## `name` — optional, string — defaults to `"theme"`

The `name` attribute on the hidden `<input type="hidden">` that carries
the active slug, so the select participates in a surrounding `<form>`
exactly as the old native `<select>` did.

It also serves as the discriminator on the managed `<link>` element
(`data-lily-theme-select="{name}"`), so multiple selects can coexist by
giving each a distinct `name`.

## `extension` — optional, string — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

## `target` — optional, HTMLElement | null

Element that receives `data-theme` on each apply. Defaults to
`document.documentElement` (i.e. `<html>`). Pass a specific element
when you want themes scoped to a section of the page rather than
the whole document.

In Vue, the natural pattern is to use a template ref:

```vue
<script setup lang="ts">
import { ref } from "vue";
const section = ref<HTMLElement | null>(null);
</script>

<template>
    <section ref="section">
        <ThemeSelect
            label="Section theme"
            themes-url="/assets/themes/"
            :themes="['light', 'dark']"
            :target="section"
        />
    </section>
</template>
```

## `themeLabels` — optional, Record<string, string>

Per-slug display label override. When unset, default labels
title-case the slug: `"light"` → `"Light"`, `"abyss"` → `"Abyss"`.
Use `themeLabels` for i18n or for slugs that don't gracefully
title-case (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

These labels are also what the listbox typeahead matches against, so
localising them localises the typeahead too.

## `class` — optional, string

Extra CSS class hook on the root `<div>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector.

## Default scoped slot

Replaces the **button glyph** — not the options. The slot receives:

```ts
type SlotArgs = {
    value: string;                        // the active slug
    open: boolean;                        // is the listbox open?
    labelFor: (theme: string) => string;  // resolved display label
};
```

`ChildArgs` is exported as an alias of `SlotArgs`.

Slot content is decorative: the button's accessible name always comes
from `label` via `aria-label`, so keep the content `aria-hidden="true"`
or text-free, and never render interactive markup inside it. See
[custom-rendering.md](./custom-rendering.md) for patterns.

## Attribute fall-through

Any other attribute (`id`, `data-*`, `@click`) flows to the root
`<div>` via Vue's default `inheritAttrs: true`. Use this to attach test
IDs, analytics handlers, and layout hooks without forking the
component.

Note the limit: fall-through reaches the root `<div>`, **not** the
button or the listbox. Passing `aria-label` as a bare attribute puts it
on the wrapper and leaves the button's own name untouched — use the
`label` prop for that.

---

Lily™ and Lily Design System™ are trademarks.
