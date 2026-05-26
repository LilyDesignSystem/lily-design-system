<script setup lang="ts">

    // BulgariaEdinenGrazhdanskiNomerView component
    //
    // A headless display for Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN).
    // Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_citizenship_number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- BulgariaEdinenGrazhdanskiNomerView.vue -->
    <span
        class="bulgaria-edinen-grazhdanski-nomer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
