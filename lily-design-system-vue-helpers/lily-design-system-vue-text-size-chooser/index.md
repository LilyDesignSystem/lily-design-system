# TextSizeChooser (Vue helper)

A reusable, headless Vue 3 **text-size chooser**. Renders an icon
button that opens a WAI-ARIA APG listbox of text-size slugs and, on
every change, sets `data-text-size="{slug}"` on a target element
(default `document.documentElement`), optionally persisting the choice
to `localStorage`. Ships no CSS — the consumer maps each size slug to
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

Same shape as the `theme-chooser` and `locale-chooser` helpers: all
three are an icon button plus a listbox, so you wire them identically.

For the full contract see [spec/index.md](./spec/index.md) — it is the single
source of truth for the API, behaviour, and tests.

> **Breaking change (unreleased).** This helper used to render a
> native `<select>`. It is now an icon button + listbox. The default
> slot now replaces the **button glyph** rather than the options, and
> its scoped props change from `{ sizes, value, setSize, name,
> labelFor }` to `{ value, open, labelFor }`. See
> [CHANGELOG.md](./CHANGELOG.md) for the migration.

## Install

This directory is published as a folder-style import; consumers
either copy it into their project or wire it as a workspace
dependency. The only runtime dependency is `vue` ≥ 3.

```ts
import TextSizeChooser from "./lily-design-system-vue-text-size-chooser/TextSizeChooser.vue";
```

Or via the barrel (recommended; gives you the types too):

```ts
import TextSizeChooser, {
    sizeName,
    LATIN_CAPITAL_LETTER_A,
    type Props,
    type SlotArgs,
} from "./lily-design-system-vue-text-size-chooser";
```

## Quick start

```vue
<script setup lang="ts">
import { ref } from "vue";
import TextSizeChooser from "./lily-design-system-vue-text-size-chooser/TextSizeChooser.vue";

const size = ref("");
const sizeLabels = { small: "Small", medium: "Medium", large: "Large", "x-large": "X Large" };
</script>

<template>
    <TextSizeChooser
        label="Text size"
        :sizes="['small', 'medium', 'large', 'x-large']"
        v-model:value="size"
        storage-key="lily-text-size"
    />

    <p class="text-size-chooser-status" aria-live="polite">
        Text size: {{ sizeLabels[size] ?? size }}
    </p>
</template>
```

When the user picks `x-large`, the component:

- sets `data-text-size="x-large"` on `<html>`,
- writes `"x-large"` to `localStorage["lily-text-size"]`,
- emits `update:value` (driving `v-model:value`),
- emits `change` with the new slug.

The chooser does NOT change any typography itself — that is the
consumer's CSS, keyed on `[data-text-size="…"]`.

**Ship the status region.** The control is icon-only, so nothing on
screen or in the accessibility tree announces which size is active
unless you render it. See
[docs/accessibility.md](./docs/accessibility.md).

## Examples

### Default rendering

```vue
<TextSizeChooser label="Text size" :sizes="['small', 'medium', 'large']" v-model:value="size" />

<!-- Renders:
<div class="text-size-chooser">
    <input type="hidden" name="text-size" value="medium" />
    <button type="button" class="text-size-chooser-button" aria-label="Text size"
            aria-haspopup="listbox" aria-expanded="false" aria-controls="text-size-chooser-1-list">
        <span class="text-size-chooser-icon" aria-hidden="true">A</span>
    </button>
    <ul class="text-size-chooser-list" id="text-size-chooser-1-list" role="listbox"
        aria-label="Text size" tabindex="-1" hidden>
        <li class="text-size-chooser-option" id="text-size-chooser-1-option-0"
            role="option" aria-selected="false">Small</li>
        <li class="text-size-chooser-option" id="text-size-chooser-1-option-1"
            role="option" aria-selected="true" data-active>Medium</li>
        <li class="text-size-chooser-option" id="text-size-chooser-1-option-2"
            role="option" aria-selected="false">Large</li>
    </ul>
</div>
-->
```

### Pretty labels for the option text

By default the chooser title-cases each hyphen-word of the slug
(`x-large` → `X Large`, via the exported `sizeName`). Override
per-slug with `sizeLabels`:

```vue
<TextSizeChooser
    label="Text size"
    :sizes="['small', 'medium', 'large', 'x-large']"
    :size-labels="{ small: 'Compact', 'x-large': 'Huge' }"
    v-model:value="size"
/>
```

Typeahead matches against these labels, so localising them also
localises the typeahead.

### Replacing the button glyph

The default slot replaces the **glyph inside the button** — not the
options. The listbox and the whole keyboard contract stay
component-owned. Keep the content decorative and `aria-hidden`, so it
never competes with `aria-label`:

```vue
<TextSizeChooser label="Text size" :sizes="['small', 'medium', 'large']" v-model:value="size">
    <template #default="{ open }">
        <svg
            class="text-size-chooser-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
            :data-open="open ? '' : undefined"
        >
            <text x="8" y="12" text-anchor="middle" font-size="12" fill="currentColor">A</text>
        </svg>
    </template>
</TextSizeChooser>
```

### Render into a scoped target instead of `<html>`

```vue
<script setup lang="ts">
import { ref } from "vue";
import TextSizeChooser from "./lily-design-system-vue-text-size-chooser/TextSizeChooser.vue";

const region = ref<HTMLElement | null>(null);
const panelSize = ref("large");
</script>

<template>
    <section ref="region">
        <p>This panel switches text size independently of the page.</p>
        <TextSizeChooser
            label="Panel text size"
            :sizes="['small', 'medium', 'large']"
            :target="region"
            v-model:value="panelSize"
        />
    </section>
</template>
```

## Props

See [spec/index.md §4.1](./spec/index.md#41-props) for the full table.

Required props: `label`, `sizes`.

Common optional props: `value` (bindable via `v-model:value`),
`defaultValue`, `storageKey`, `sizeLabels`, `target`, `class`, `name`.

There is no `placeholder` prop and no detection prop — there is no OS
"preferred text size" media query equivalent to
`prefers-color-scheme`.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `update:value`  | `string` | After selection, drives `v-model:value`.              |
| `change`        | `string` | After the chooser applies a new size (the slug).       |

## Keyboard

On the button: `ArrowDown` / `Enter` / `Space` open on the selected
option; `ArrowUp` opens on the last option. On the listbox: arrows
move and clamp (no wrap), `Home` / `End` jump, printable characters
run a typeahead over the labels, `Enter` / `Space` commit and refocus
the button, `Escape` cancels, `Tab` closes and moves on. Full table in
[spec/index.md §6.2](./spec/index.md#62-keyboard-contract).

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) by
  letting users pick and persist a comfortable reading size.
- The button is icon-only, so `aria-label` (from `label`) is its
  **only** accessible name.
- The component implements the APG listbox pattern itself — it no
  longer inherits native `<select>` semantics. That trade is
  documented honestly in
  [docs/accessibility.md](./docs/accessibility.md); a native `<select>`
  remains the more conservative choice for some audiences.
- No colour-only meaning: the active size is in `aria-selected`, in
  `data-text-size`, and in the hidden input.

## SSR

The chooser is SSR-safe — all DOM writes happen inside `onMounted` /
`watch`. For flicker-free first paint, resolve the size on the server
(from a cookie) and pass it as `value`.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec/index.md`               | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                   | Fast-index pointer for AI agents.                |
| `CLAUDE.md`                   | `@AGENTS.md`.                                    |
| `TextSizeChooser.vue`          | The component implementation.                    |
| `TextSizeChooser.test.ts`      | vitest suite covering every spec §7 item.        |
| `index.ts`                    | Re-export barrel.                                |
| `index.md`                    | This file.                                       |
| `docs/accessibility.md`       | Accessibility rationale and tradeoffs.           |
| `CHANGELOG.md`                | Release record.                                  |

---

Lily™ and Lily Design System™ are trademarks.
