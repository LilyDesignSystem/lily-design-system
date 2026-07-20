# Custom rendering

The default slot replaces the **button glyph** — the `◑` character
inside `<span class="theme-select-icon" aria-hidden="true">`. That is
the whole of what it controls.

It does **not** render the options. The listbox, its
`<li role="option">` children, the APG keyboard contract, focus
management, and the apply lifecycle are all component-owned and cannot
be overridden from the slot. If you want swatch buttons or a segmented
control instead of a popup listbox, build that yourself and drive it
from `v-model:value`; this helper is not a headless render-prop shell.

## The SlotArgs contract

The slot receives one object with three fields:

```ts
type SlotArgs = {
    /** Currently selected theme slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};
```

`ChildArgs` is exported as an alias of `SlotArgs`, matching the
canonical Svelte helper's type name. Both come from `index.ts`:

```ts
import type { SlotArgs, ChildArgs } from "./lily-design-system-vue-theme-select";
```

In Vue templates the slot props arrive in camelCase via the
`#default="…"` destructure:

```vue
<template #default="{ value, open, labelFor }">
    <!-- … -->
</template>
```

There is no `setTheme` in the contract, and no `themes` array. The slot
sits inside the trigger button, which does not select anything — it
only opens the listbox. To change the theme programmatically, write to
the `v-model:value` binding from your own code.

## The accessibility rule

Whatever the slot renders is **decorative**. The button's accessible
name always comes from `label` via `aria-label`, so slot content must
be `aria-hidden="true"` or text-free, or it competes with that name and
produces a control announced as two conflicting things.

Two corollaries:

- **No interactive markup.** The slot's output sits inside the
  `<button>`. A nested `<button>` or `<a>` is invalid HTML and breaks
  activation. Render `<span>`, `<svg>`, or `<img>` only.
- **No text you expect to be read.** If you render a visible word, make
  sure `label` says the same thing, and still mark the visible copy
  `aria-hidden="true"`.

## Patterns

### An SVG icon instead of the glyph

The most common reason to use the slot: the default `◑` comes from the
user's fonts and may render inconsistently or be missing entirely. An
inline SVG renders identically everywhere and inherits `currentColor`.

```vue
<ThemeSelect
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
    v-model:value="theme"
>
    <template #default>
        <svg
            class="theme-select-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
            <path d="M8 1a7 7 0 0 1 0 14Z" fill="currentColor" />
        </svg>
    </template>
</ThemeSelect>
```

### A swatch previewing the active theme

`value` gives you the active slug, so the glyph can preview the theme
it represents by hooking into the same `:root[data-theme]` cascade the
theme files use:

```vue
<template #default="{ value, labelFor }">
    <span
        class="theme-select-swatch"
        :data-theme="value"
        :title="labelFor(value)"
        aria-hidden="true"
    />
</template>
```

`title` is safe here: it is an advisory tooltip for pointer users and
does not become the accessible name, because `aria-label` on the button
takes precedence.

Working example:
[`../examples/custom-rendering.vue`](../examples/custom-rendering.vue).

### Reflecting the open state

`open` tracks the listbox, so the trigger can show a caret that turns:

```vue
<template #default="{ value, open, labelFor }">
    <span
        class="theme-select-swatch"
        :data-theme="value"
        :title="labelFor(value)"
        aria-hidden="true"
    />
    <span class="theme-select-caret" aria-hidden="true">{{ open ? "▴" : "▾" }}</span>
</template>
```

You do not need `open` for state *styling* — `aria-expanded` is already
on the button, so `.theme-select-button[aria-expanded="true"]` works
from CSS. Reach for `open` when the content itself must change, as
above.

## What the slot should *not* do

- **Don't render `<option>` or `<li>` elements.** They would land
  inside the `<button>`, not inside the listbox. The options are
  component-owned.
- **Don't mutate `document.head` or `data-theme` directly.** Let the
  component own that lifecycle; write to `v-model:value` instead.
- **Don't render focusable content.** One button, one tab stop.
- **Don't introduce a competing accessible name.** See the
  accessibility rule above and
  [`accessibility.md`](./accessibility.md).

## Why Vue slot props arrive camelCase

You expose slot props with kebab-case attributes in a template
(`:label-for="labelFor"`), but Vue's destructure on the consumer side
resolves them in camelCase (`{ labelFor }`). The `SlotArgs` TypeScript
type uses camelCase so editors auto-complete correctly.

This component binds the whole object at once, which sidesteps the
question entirely:

```vue
<slot v-bind="{ value: current, open, labelFor }">
    <span class="theme-select-icon" aria-hidden="true">◑</span>
</slot>
```

Consumers destructure in camelCase regardless. This is the same
convention every Vue 3 scoped-slot library uses.

---

Lily™ and Lily Design System™ are trademarks.
