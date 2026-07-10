# TextSizeSelect (Vue helper)

A reusable, headless Vue 3 **text-size select**. Renders a native
`<select>` of text-size slugs and, on every change, sets
`data-text-size="{slug}"` on a target element (default
`document.documentElement`), optionally persisting the choice to
`localStorage`. Ships no CSS — the consumer maps each size slug to
real typography via CSS, e.g.:

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }
```

This supports WCAG 2.2 — 1.4.4 (Resize Text) and 1.4.12 (Text
Spacing) — by letting users pick a comfortable reading size that the
app remembers.

For the full contract see [spec/index.md](./spec/index.md) — it is the single
source of truth for the API, behaviour, and tests.

## Install

This directory is published as a folder-style import; consumers
either copy it into their project or wire it as a workspace
dependency. The only runtime dependency is `vue` ≥ 3.

```ts
import TextSizeSelect from "./lily-design-system-vue-text-size-select/TextSizeSelect.vue";
```

Or via the barrel (recommended; gives you the types too):

```ts
import TextSizeSelect, {
    type Props,
    type SlotArgs,
} from "./lily-design-system-vue-text-size-select";
```

## Quick start

```vue
<script setup lang="ts">
import { ref } from "vue";
import TextSizeSelect from "./lily-design-system-vue-text-size-select/TextSizeSelect.vue";

const size = ref("");
</script>

<template>
    <TextSizeSelect
        label="Text size"
        :sizes="['small', 'medium', 'large', 'x-large']"
        v-model:value="size"
        storage-key="lily-text-size"
    />
</template>
```

When the user picks `x-large`, the component:

- sets `data-text-size="x-large"` on `<html>`,
- writes `"x-large"` to `localStorage["lily-text-size"]`,
- emits `update:value` (driving `v-model:value`),
- emits `change` with the new slug.

The select does NOT change any typography itself — that is the
consumer's CSS, keyed on `[data-text-size="…"]`.

## Examples

### Default `<select>`

```vue
<TextSizeSelect label="Text size" :sizes="['small', 'medium', 'large']" v-model:value="size" />

<!-- Renders:
<select class="text-size-select" aria-label="Text size" name="text-size">
    <option class="text-size-select-option" value="small">Small</option>
    <option class="text-size-select-option" value="medium">Medium</option>
    <option class="text-size-select-option" value="large">Large</option>
</select>
-->
```

### Pretty labels for the option text

By default the select title-cases each hyphen-word of the slug
(`x-large` → `X Large`). Override per-slug with `sizeLabels`:

```vue
<TextSizeSelect
    label="Text size"
    :sizes="['small', 'medium', 'large', 'x-large']"
    :size-labels="{ small: 'Compact', 'x-large': 'Huge' }"
    v-model:value="size"
/>
```

### Driving custom `<option>` markup

Use the default scoped slot for full markup control. The select still
owns the apply lifecycle:

```vue
<TextSizeSelect label="Text size" :sizes="['small', 'medium', 'large']" v-model:value="size">
    <template #default="{ sizes, value, setSize, labelFor }">
        <select
            aria-label="Text size"
            @change="(e) => setSize((e.target as HTMLSelectElement).value)"
        >
            <option
                v-for="s in sizes"
                :key="s"
                :value="s"
                :selected="value === s"
            >
                {{ labelFor(s) }}
            </option>
        </select>
    </template>
</TextSizeSelect>
```

### Render into a scoped target instead of `<html>`

```vue
<script setup lang="ts">
import { ref } from "vue";
import TextSizeSelect from "./lily-design-system-vue-text-size-select/TextSizeSelect.vue";

const region = ref<HTMLElement | null>(null);
const panelSize = ref("large");
</script>

<template>
    <section ref="region">
        <p>This panel switches text size independently of the page.</p>
        <TextSizeSelect
            label="Panel text size"
            :sizes="['small', 'medium', 'large']"
            :target="region"
            v-model:value="panelSize"
        />
    </section>
</template>
```

## Props

See [spec/index.md §4](./spec/index.md#4-props) for the full table.

Required props: `label`, `sizes`.

Common optional props: `value` (bindable via `v-model:value`),
`defaultValue`, `storageKey`, `sizeLabels`, `target`, `class`, `name`.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `update:value`  | `string` | After selection, drives `v-model:value`.              |
| `change`        | `string` | After the select applies a new size (the slug).       |

## Accessibility

- `<select aria-label="…">` is the announced control (implicit
  `combobox` role).
- The native `<select>` gives Arrow / Home / End / typeahead
  semantics for free.
- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) by
  letting users pick and persist a comfortable reading size.
- No colour-only meaning; the active state is visible in the
  `<select>`'s current value and the resolved `data-text-size`.

## SSR

The select is SSR-safe — all DOM writes happen inside `onMounted` /
`watch`. For flicker-free first paint, resolve the size on the server
(from a cookie) and pass it as `value`.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec/index.md`                     | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                   | Fast-index pointer for AI agents.                |
| `CLAUDE.md`                   | `@AGENTS.md`.                                    |
| `TextSizeSelect.vue`          | The component implementation.                    |
| `TextSizeSelect.test.ts`      | vitest suite covering every spec §7 item.        |
| `index.ts`                    | Re-export barrel.                                |
| `index.md`                    | This file.                                       |

---

Lily™ and Lily Design System™ are trademarks.
