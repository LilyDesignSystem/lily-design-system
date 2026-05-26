<script setup lang="ts">

    // HrvatskaOsobniIdentifikacijskiBrojView component
    //
    // A headless display for Croatia's Osobni identifikacijski broj (OIB).
    // Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- HrvatskaOsobniIdentifikacijskiBrojView.vue -->
    <span
        class="hrvatska-osobni-identifikacijski-broj-view"
        :aria-label="label">{{ value }}</span
    >
</template>
