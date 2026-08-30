<script setup lang="ts">

    // CymruRhifYGwasanaethIechydGwladolView component
    //
    // A headless display for Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG).
    // Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHS_number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- CymruRhifYGwasanaethIechydGwladolView.vue -->
    <span
        class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-view"
        :aria-label="label">{{ value }}</span
    >
</template>
