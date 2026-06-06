# Conventions — Lily Vue Helpers

Working rules for every helper in this catalog. The
[shared/](./shared/) files inherit from the Lily-wide
`AGENTS/headless.md`, `internationalization.md`, and `theme.md`; this
file lists the Vue-specific decisions layered on top.

## File shape per helper

```
lily-design-system-vue-<name>/
├── spec.md             ← single source of truth, numbered with §
├── AGENTS.md           ← fast-index pointer for agents
├── AGENTS/             ← per-helper topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── CLAUDE.md           ← `@AGENTS.md`
├── index.md            ← comprehensive human-readable guide
├── index.ts            ← barrel re-export
├── {Pascal}.vue        ← `<script setup lang="ts">` SFC
├── {Pascal}.test.ts    ← vitest spec
├── CHANGELOG.md
├── docs/               ← topic-by-topic deep-dives
└── examples/           ← runnable `.vue` SFCs
```

## Component file shape

Every helper SFC follows this template:

```vue
<script lang="ts">
/** Public scoped-slot args. */
export type SlotArgs = { /* … */ };

/** Public props — see spec.md §4. */
export type Props = { /* … */ };

/** Pure helpers exported for consumer reuse. */
export function helperName() { /* … */ }
</script>

<script setup lang="ts">
import { onMounted, watch } from "vue";

const props = withDefaults(defineProps<Props>(), { /* … */ });
const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();

onMounted(() => { /* initial-value resolution */ });
watch(() => props.value, (next, prev) => { /* apply */ });
</script>

<template>
    <root-element
        :class="`{base-class} ${props.class ?? ''}`.trim()"
        role="..."
        :aria-label="label"
    >
        <slot v-bind="slotArgs"><!-- default markup --></slot>
    </root-element>
</template>
```

The split between a plain `<script lang="ts">` block (for types and
pure helpers, which Vue exposes as named exports of the SFC module)
and the `<script setup lang="ts">` block (for the component body) is
the recommended Vue 3 pattern when you want to export both a
component and supporting helpers from one file.

## Two-way binding

Use `v-model:value` for the bindable selection. The custom prop
name (rather than the default `modelValue`) keeps the API symmetric
with the Svelte canonical's `bind:value` and reads naturally:

```vue
<ThemePicker v-model:value="theme" ... />
```

Inside the component:

```ts
const props = withDefaults(defineProps<Props>(), { value: "" });
const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();
```

`defineModel` is acceptable for new helpers but the existing two
helpers use `defineProps` + explicit `emit("update:value", …)` for
finer control over when the bind-back happens (so we can suppress it
during initial-value resolution).

## Slots

The Vue equivalent of Svelte snippets / React render-props is the
default scoped slot:

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

Consumers use kebab-case attribute names on the template side:

```vue
<ThemePicker>
    <template #default="{ themes, value, setTheme, labelFor }">
        <!-- … -->
    </template>
</ThemePicker>
```

Vue automatically converts kebab-case slot props to camelCase in the
destructured object, so the `SlotArgs` type stays in camelCase.

## Class / style fall-through

Vue forwards `$attrs` to the root element by default
(`inheritAttrs: true`). Each helper declares the root's static class
hook with `:class="\`{base} ${props.class}\`.trim()"` so a consumer
can pass `class="my-extra"` and end up with both classes on the
root. Other attrs (`data-*`, `id`, event handlers, ARIA overrides)
fall through automatically.

We never declare `inheritAttrs: false` because it would break the
expected spread behaviour.

## SSR

`onMounted` and `watch` only run in the browser; the SSR render
emits static markup with whatever `value` the consumer supplied. No
DOM access, no `document.*`, no `window.*` outside lifecycle hooks.

If you need a `document.head` mutation, do it in `onMounted` /
`watch`, not in the `<script setup>` top level.

## What never lives in the helper

- Bundled CSS, fonts, icons, or images.
- A locale-aware default for `label` / `placeholder` / `error`.
- Routing, data fetching, persistence wrappers, network calls.
- Animations or transitions.

Everything visual and locale-specific is the consumer's. See
[`shared/headless-principles.md`](./shared/headless-principles.md).

## Naming

- Class hooks are kebab-case derivatives of the file name:
  `theme-picker`, `theme-picker-option`, `theme-picker-option-label`.
- Data attributes the consumer / CSS may want to observe use
  `data-*` (e.g. `data-theme`, `data-lily-theme-picker`).
- Don't introduce new ARIA attributes — use the platform's.
