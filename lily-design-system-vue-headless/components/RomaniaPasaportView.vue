<script setup lang="ts">

    // RomaniaPasaportView component
    //
    // A headless display for Romania's Paşaport.
    // Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Romanian_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- RomaniaPasaportView.vue -->
    <span
        class="romania-pasaport-view"
        :aria-label="label">{{ value }}</span
    >
</template>
