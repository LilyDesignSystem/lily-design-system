<!--
    Example 5 — Custom button glyph via the default scoped slot.

    By default the button renders a single half-circle glyph (U+25D1)
    inside <span class="theme-chooser-icon" aria-hidden="true">. The
    default slot REPLACES that glyph — as of the icon-button rewrite it
    no longer renders the options. The listbox, its options, the
    keyboard contract, and the apply lifecycle all stay
    component-owned; the slot only decides what the closed button looks
    like.

    The slot receives:
      - value:    the active slug
      - open:     whether the listbox is currently open
      - labelFor: the resolved display label for a slug

    Below, the glyph becomes a small swatch previewing the active
    theme's colours (via the same :root[data-theme] cascade the themes
    themselves use) plus a caret that reflects the open state.

    Accessibility note: whatever you render here is decorative. The
    button's accessible name always comes from `label` via aria-label,
    so keep your own markup aria-hidden="true" (or text-free) rather
    than introducing a competing name.
-->
<script setup lang="ts">
import ThemeChooser from "../ThemeChooser.vue";
</script>

<template>
    <ThemeChooser
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss', 'cupcake', 'dracula']"
    >
        <template #default="{ value, open, labelFor }">
            <span
                class="theme-chooser-swatch"
                :data-theme="value"
                :title="labelFor(value)"
                aria-hidden="true"
            />
            <span class="theme-chooser-caret" aria-hidden="true">{{
                open ? "▴" : "▾"
            }}</span>
        </template>
    </ThemeChooser>
</template>
