<script setup lang="ts">

    // NederlandPaspoortNummerView component
    //
    // A headless display for Netherlands's Paspoort Nummer.
    // Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9].
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Dutch_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- NederlandPaspoortNummerView.vue -->
    <span
        class="nederland-paspoort-nummer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
