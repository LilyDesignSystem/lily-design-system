# Custom rendering

The default slot is a set of native `<option>` elements inside the
`<select>`. When you need a different visual — swatch buttons, a
segmented control, a flyout menu — pass your own scoped slot.

## The SlotArgs contract

The slot receives one object with five fields:

```ts
type SlotArgs = {
    themes: string[];                    // the available slugs
    value: string;                       // the active slug
    setTheme: (theme: string) => void;   // imperative apply (writes value)
    name: string;                        // shared identity for the select
    labelFor: (theme: string) => string; // resolved display label
};
```

`setTheme(slug)` emits `update:value` (driving `v-model:value`).
The select's `watch` on `value` then performs the four steps in
[spec/index.md §5.3](../spec/index.md#53-applying-a-theme).

In Vue templates, the slot props arrive in camelCase via the
`#default="…"` destructure:

```vue
<template #default="{ themes, value, setTheme, name, labelFor }">
    <!-- … -->
</template>
```

## Patterns

### Swatch buttons

```vue
<ThemeSelect
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
>
    <template #default="{ themes, value, setTheme, labelFor }">
        <button
            v-for="t in themes"
            :key="t"
            type="button"
            class="theme-select-swatch"
            :data-theme="t"
            :aria-pressed="value === t"
            @click="setTheme(t)"
        >
            {{ labelFor(t) }}
        </button>
    </template>
</ThemeSelect>
```

`aria-pressed` carries the active state; the select no longer
renders a native `<select>` of options, so the implicit option
selection is gone. The `data-theme` on each button lets your CSS
preview the swatch colours by hooking into the same
`:root[data-theme]` cascade.

Note: because the slot replaces the default `<option>`s, rendering
non-`<option>` markup means you are no longer inside a native
`<select>`. If you want button or segmented-control semantics,
render your custom controls outside the select and call `setTheme`
from a wrapper component instead.

### Custom option markup

If you want the native `<select>` semantics but custom option
labels:

```vue
<ThemeSelect
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
>
    <template #default="{ themes, value, labelFor }">
        <option
            v-for="t in themes"
            :key="t"
            :value="t"
            :selected="value === t"
        >
            {{ labelFor(t) }}
        </option>
    </template>
</ThemeSelect>
```

The select's `<select>` owns the `change` handler, so the slot only
needs to render `<option>` elements.

## What the slot should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  select own that lifecycle.
- Don't render non-`<option>` markup directly inside the select —
  the root is a native `<select>`. For a non-`<select>` UI, render
  your controls outside the select and call `setTheme` from a
  wrapper.

## Why Vue slot props arrive camelCase

You expose slot props with kebab-case attributes in the template
(`:set-theme="setTheme"`), but Vue's destructure on the consumer
side resolves them in camelCase (`{ setTheme }`). The `SlotArgs`
TypeScript type uses camelCase so editors auto-complete correctly.

The component template uses the kebab-case form:

```vue
<slot
    :themes="themes"
    :value="value ?? ''"
    :set-theme="setTheme"
    :name="name"
    :label-for="labelFor"
>
    <!-- default markup -->
</slot>
```

Consumers destructure in camelCase regardless. This is the same
convention every Vue 3 scoped-slot library uses.
