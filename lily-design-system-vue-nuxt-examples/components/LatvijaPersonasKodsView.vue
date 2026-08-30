<script setup lang="ts">

    // LatvijaPersonasKodsView component
    //
    // A headless display for Latvia's Personas kods.
    // Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Latvia

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- LatvijaPersonasKodsView.vue -->
    <span
        class="latvija-personas-kods-view"
        :aria-label="label">{{ value }}</span
    >
</template>
