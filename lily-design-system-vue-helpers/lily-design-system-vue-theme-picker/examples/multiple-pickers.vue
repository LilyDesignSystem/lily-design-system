<!--
    Example 7 — Multiple pickers in one page.

    Each picker gets a distinct `name`. The `name` plays two roles:
      1. It is the radio-input `name`, so the two groups don't share state.
      2. It is the discriminator on the managed <link> element, so each
         picker swaps its own stylesheet without stepping on the other.

    This is useful for: a "global" theme + a per-section accent theme;
    preview-vs-live theme A/B; or a settings page that compares two
    themes side-by-side.

    Note: the active `data-theme` attribute on <html> is set by whichever
    picker fires last. If you want two independent regions, pass a
    per-picker `target` so each updates a different DOM subtree.
-->
<script setup lang="ts">
import { ref } from "vue";
import ThemePicker from "../ThemePicker.vue";

const regionA = ref<HTMLElement | null>(null);
const regionB = ref<HTMLElement | null>(null);
</script>

<template>
    <section ref="regionA">
        <ThemePicker
            label="Region A theme"
            name="region-a"
            themes-url="/assets/themes/"
            :themes="['light', 'dark']"
            :target="regionA"
        />
    </section>

    <section ref="regionB">
        <ThemePicker
            label="Region B theme"
            name="region-b"
            themes-url="/assets/themes/"
            :themes="['abyss', 'cupcake', 'dracula']"
            :target="regionB"
        />
    </section>
</template>
