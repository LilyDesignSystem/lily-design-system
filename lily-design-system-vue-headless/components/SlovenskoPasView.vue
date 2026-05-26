<script setup lang="ts">

    // SlovenskoPasView component
    //
    // A headless display for Slovakia's Pas.
    // Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Slovak_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- SlovenskoPasView.vue -->
    <span
        class="slovensko-pas-view"
        :aria-label="label">{{ value }}</span
    >
</template>
