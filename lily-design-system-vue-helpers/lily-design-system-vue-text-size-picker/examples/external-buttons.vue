<!--
    Example 7 — Driving the control from your own UI.

    Sometimes you want bigger, more discoverable affordances than a
    dropdown — an A- / A+ style preset row in a settings page, say.
    Because `value` is a plain `v-model:value` binding, your own
    buttons can drive the picker just by assigning the ref: the picker's
    `watch(() => props.value, …)` mirrors the change straight through
    the same lifecycle the listbox uses — data-text-size is set,
    localStorage is written, and `change` / `update:value` fire.

    `sizeName` is exported for exactly this reason: your own UI can
    render labels that match the listbox without duplicating the
    title-casing rule.

    Note the aria-pressed on each preset button — these are toggles, and
    the state must be readable by assistive technology, not just visible
    as a highlight (WCAG 1.4.1: no colour-only meaning).
-->
<script setup lang="ts">
import { ref } from "vue";
import TextSizePicker, { sizeName } from "../TextSizePicker.vue";

const sizes = ["small", "medium", "large", "x-large"];
const size = ref("");
</script>

<template>
    <TextSizePicker
        label="Text size"
        :sizes="sizes"
        storage-key="my-app:text-size"
        v-model:value="size"
    />

    <div role="group" aria-label="Text size presets">
        <button
            v-for="slug in sizes"
            :key="slug"
            type="button"
            :aria-pressed="slug === size ? 'true' : 'false'"
            @click="size = slug"
        >
            {{ sizeName(slug) }}
        </button>
    </div>

    <p class="text-size-picker-status" aria-live="polite">
        Text size: {{ size ? sizeName(size) : "none" }}
    </p>
</template>
