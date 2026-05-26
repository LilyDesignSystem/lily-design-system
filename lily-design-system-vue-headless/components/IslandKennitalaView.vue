<script setup lang="ts">

    // IslandKennitalaView component
    //
    // A headless display for Iceland's Kennitala.
    // Format: 10 digits where the first 6 are the date of birth (DDMMYY).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Kennitala

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- IslandKennitalaView.vue -->
    <span
        class="island-kennitala-view"
        :aria-label="label">{{ value }}</span
    >
</template>
