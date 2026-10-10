<!--
    Example 6 — Multiple pickers in one page.

    Each picker gets a distinct `name`, so the two controls don't share
    hidden-input state. Passing a per-picker `target` also lets each
    picker resize its own region independently rather than fighting over
    `data-text-size` on <html>.

    This is useful for: a "global" text size + a per-section override
    (e.g. a printable panel that must stay compact); or a settings page
    that compares two sizes side-by-side.

    Note: without a `target`, the active `data-text-size` attribute on
    <html> is set by whichever picker fires last.
-->
<script setup lang="ts">
import { ref } from "vue";
import TextSizePicker from "../TextSizePicker.vue";

const regionA = ref<HTMLElement | null>(null);
const regionB = ref<HTMLElement | null>(null);
</script>

<template>
    <section ref="regionA">
        <TextSizePicker
            label="Article text size"
            name="article-text-size"
            :sizes="['small', 'medium', 'large', 'x-large']"
            :target="regionA"
        />
    </section>

    <section ref="regionB">
        <TextSizePicker
            label="Sidebar text size"
            name="sidebar-text-size"
            :sizes="['small', 'medium', 'large']"
            :target="regionB"
        />
    </section>
</template>
