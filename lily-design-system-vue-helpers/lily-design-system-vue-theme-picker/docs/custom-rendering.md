# Custom rendering

The default slot is a row of native radio inputs. When you need a
different visual — swatch buttons, a dropdown, a segmented control,
a flyout menu — pass your own scoped slot.

## The SlotArgs contract

The slot receives one object with five fields:

```ts
type SlotArgs = {
    themes: string[];                    // the available slugs
    value: string;                       // the active slug
    setTheme: (theme: string) => void;   // imperative apply (writes value)
    name: string;                        // shared identity for the picker
    labelFor: (theme: string) => string; // resolved display label
};
```

`setTheme(slug)` emits `update:value` (driving `v-model:value`).
The picker's `watch` on `value` then performs the four steps in
[spec.md §5.3](../spec.md#53-applying-a-theme).

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
<ThemePicker
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
>
    <template #default="{ themes, value, setTheme, labelFor }">
        <button
            v-for="t in themes"
            :key="t"
            type="button"
            class="theme-picker-swatch"
            :data-theme="t"
            :aria-pressed="value === t"
            @click="setTheme(t)"
        >
            {{ labelFor(t) }}
        </button>
    </template>
</ThemePicker>
```

`aria-pressed` carries the active state; the picker no longer
renders radios, so `aria-checked` is gone. The `data-theme` on each
button lets your CSS preview the swatch colours by hooking into the
same `:root[data-theme]` cascade.

### Native `<select>` dropdown

```vue
<ThemePicker
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark', 'abyss']"
>
    <template #default="{ themes, value, setTheme, labelFor }">
        <label class="theme-picker-select-label">
            <select
                :value="value"
                @change="(e) => setTheme((e.target as HTMLSelectElement).value)"
            >
                <option v-for="t in themes" :key="t" :value="t">
                    {{ labelFor(t) }}
                </option>
            </select>
        </label>
    </template>
</ThemePicker>
```

Note: the outer `<fieldset role="radiogroup">` is still present.
If you don't want radiogroup semantics, render a `<select>` outside
the picker and call `setTheme` from a wrapping component instead.

### Custom radio markup

If you want native radio semantics but a custom visual layout:

```vue
<ThemePicker
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark']"
>
    <template #default="{ themes, value, setTheme, name, labelFor }">
        <label
            v-for="t in themes"
            :key="t"
            :class="`my-radio ${value === t ? 'is-active' : ''}`"
        >
            <input
                type="radio"
                :name="name"
                :value="t"
                :checked="value === t"
                @change="setTheme(t)"
            />
            <span class="my-radio-swatch" aria-hidden="true"></span>
            <span class="my-radio-label">{{ labelFor(t) }}</span>
        </label>
    </template>
</ThemePicker>
```

## What the slot should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  picker own that lifecycle.
- Don't add a competing `name` to your inputs — use the one
  provided by the slot args.
- Don't render outside the `<fieldset>`; the picker assumes its
  slot output is inside the radiogroup container.

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
