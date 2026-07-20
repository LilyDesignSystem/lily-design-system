# Custom rendering

The default slot replaces the **button glyph** — the 🌐 inside the
trigger — and nothing else. The listbox, its `<li role="option">`
children, the keyboard contract, and the apply lifecycle (`lang` /
`dir` / storage / `change`) stay component-owned.

This is a deliberate boundary. The parts you might want to restyle are
reachable through CSS hooks; the parts that are hard to get right —
`aria-activedescendant` bookkeeping, typeahead, focus return, RTL
detection — are not delegable without re-opening every bug the
component exists to close.

```vue
<LocaleSelect label="Language" :locales="locales" v-model:value="locale">
    <template #default="{ value, open, labelFor }">
        <!-- replaces the 🌐 span -->
    </template>
</LocaleSelect>
```

## The SlotArgs contract

```ts
type SlotArgs = {
    /** Currently selected locale code, in consumer form (`en_US`, not `en-US`). */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a code to its display label, honouring `localeLabels`. */
    labelFor: (locale: string) => string;
};
```

`ChildArgs` is exported as an alias, matching the canonical Svelte
helper's type name.

Note what `value` is *not*: it is not BCP 47-normalised. If you render
it as a `lang` attribute, run it through the exported
`bcp47LocaleTag()` first — see [bcp47.md](./bcp47.md).

```vue
<script setup lang="ts">
import LocaleSelect, { bcp47LocaleTag } from "lily-design-system-vue-locale-select";
</script>
```

## The accessibility rule

**Whatever the slot renders is decorative.** The button's accessible
name always comes from `label` via `aria-label`, and `aria-label` wins
over descendant text. So slot content either:

- carries `aria-hidden="true"`, or
- contains no text at all.

If you render visible text without `aria-hidden`, sighted users and
screen-reader users get different information about the same control —
the screen reader still reads `label` and never mentions what is on
screen. That is the failure mode this rule prevents.

```vue
<template #default="{ value }">
    <span aria-hidden="true">{{ value.slice(0, 2).toUpperCase() }}</span>
</template>
```

## Patterns

### The active locale's short code

The most common replacement: swap the globe for the language code, so
the closed control says something. Cheap, script-neutral, and fits a
narrow header.

```vue
<template #default="{ value }">
    <span aria-hidden="true">{{ value.split(/[-_]/)[0].toUpperCase() }}</span>
</template>
```

See [`../examples/custom-rendering.vue`](../examples/custom-rendering.vue).

### A script-aware glyph

Render the active locale's endonym in its own script and direction, so
the trigger looks right to the user whose language it is. This is the
pattern that most repays the effort, and it is why `labelFor` is in
the slot args at all.

```vue
<script setup lang="ts">
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
} from "lily-design-system-vue-locale-select";
</script>

<template>
    <LocaleSelect label="Language" :locales="locales" :locale-labels="endonyms">
        <template #default="{ value, labelFor }">
            <span
                aria-hidden="true"
                :lang="bcp47LocaleTag(value)"
                :dir="isRtlLocale(value) ? 'rtl' : 'ltr'"
            >{{ labelFor(value) }}</span>
        </template>
    </LocaleSelect>
</template>
```

The `lang` on the span is not for the accessibility tree here — the
span is `aria-hidden` — it is for the *font stack*, so the browser
picks a face that can render the script.

See [`../examples/script-aware-glyph.vue`](../examples/script-aware-glyph.vue).

### An SVG icon instead of the glyph

The default 🌐 depends on a font that has it. An inline SVG removes
that dependency entirely and is the safest choice for a design system
with a fixed icon set.

```vue
<template #default>
    <svg
        aria-hidden="true"
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" />
    </svg>
</template>
```

`focusable="false"` matters for older Edge/IE, which otherwise put SVGs
in the tab order.

### Reflecting the open state

`open` lets the trigger show a caret that agrees with the listbox.

```vue
<template #default="{ value, open }">
    <span aria-hidden="true">
        {{ value.split(/[-_]/)[0].toUpperCase() }}
        <span :class="open ? 'caret caret-up' : 'caret caret-down'" />
    </span>
</template>
```

You rarely need this — `aria-expanded` is already on the button, so
CSS can do the whole job:

```css
.locale-select-button[aria-expanded="true"] .caret { transform: rotate(180deg); }
```

Prefer the CSS route; it keeps the state in one place.

## What the slot should *not* do

- **Render the option list.** It cannot — the slot sits inside the
  `<button>`. Style `.locale-select-option` instead.
- **Carry the accessible name.** That is `label`.
- **Own an interactive element.** A `<button>` or `<a>` inside the
  trigger `<button>` is invalid HTML and breaks keyboard behaviour.
- **Call `setLocale`.** It is not in the slot args by design. Bind
  `v-model:value` and write to your own ref — see
  [`../examples/combobox.vue`](../examples/combobox.vue) for a fully
  custom control driven that way.

## If you need a different control entirely

The slot is for the glyph. If you want a segmented control, a
flag grid, a dialog picker, or a `<datalist>` combobox, do not fight
the slot — render your own UI and bind it to the same ref the select
binds to:

```vue
<script setup lang="ts">
const locale = ref("en");
</script>

<template>
    <LocaleSelect label="Language" :locales="locales" v-model:value="locale" />
    <MyOwnPicker v-model="locale" />
</template>
```

Both stay in sync, the select keeps owning the `lang` / `dir` /
storage lifecycle, and your UI owns presentation.
[`../examples/combobox.vue`](../examples/combobox.vue) does exactly
this.

## Why Vue slot props arrive camelCase

Props on the *template* side are kebab-case (`:locale-labels`), but
slot props are plain JavaScript object keys, so they stay camelCase
(`labelFor`, not `label-for`). This trips people who have just written
a kebab-case prop list one line above.

## See also

- [styling.md](./styling.md) — the CSS hooks.
- [accessibility.md](./accessibility.md) — why slot content is decorative.
- [bcp47.md](./bcp47.md) — consumer form vs. BCP 47 tag.
- [`../spec/index.md`](../spec/index.md) §4.3 — the canonical slot contract.
