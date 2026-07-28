<!--
    Example 5 — Custom button glyph via the default scoped slot.

    By default the button renders a single "A" glyph (U+0041) inside
    <span class="text-size-picker-icon" aria-hidden="true">. The default
    slot REPLACES that glyph — it does not render the options. The
    listbox, its options, the keyboard contract, and the apply lifecycle
    all stay component-owned; the slot only decides what the closed
    button looks like.

    The slot receives:
      - value:    the active slug
      - open:     whether the listbox is currently open
      - labelFor: the resolved display label for a slug

    Below, the glyph becomes the conventional two-size "A A" affordance
    (a small A and a large A) as an inline SVG, plus a caret that
    reflects the open state — see ../docs/accessibility.md, "Tradeoff 3:
    the glyph is font-dependent".

    Accessibility note: whatever you render here is decorative. The
    button's accessible name always comes from `label` via aria-label,
    so keep your own markup aria-hidden="true" (or text-free) rather
    than introducing a competing name.
-->
<script setup lang="ts">
import TextSizePicker from "../TextSizePicker.vue";
</script>

<template>
    <TextSizePicker
        label="Text size"
        :sizes="['small', 'medium', 'large', 'x-large']"
    >
        <template #default="{ open }">
            <svg
                class="text-size-picker-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
                :data-open="open ? '' : undefined"
            >
                <text x="1" y="13" font-size="8" fill="currentColor">A</text>
                <text x="7" y="13" font-size="13" fill="currentColor">A</text>
            </svg>
            <span class="text-size-picker-caret" aria-hidden="true">{{
                open ? "▴" : "▾"
            }}</span>
        </template>
    </TextSizePicker>
</template>
