<script setup lang="ts">

    // NederlandIdentiteitskaartNummerView component
    //
    // A headless display for Netherlands's Identiteitskaart Nummer.
    // Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Dutch_identity_card

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- NederlandIdentiteitskaartNummerView.vue -->
    <span
        class="nederland-identiteitskaart-nummer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
