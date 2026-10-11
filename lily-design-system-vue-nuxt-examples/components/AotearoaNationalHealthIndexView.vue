<script setup lang="ts">

    // AotearoaNationalHealthIndexView component
    //
    // A headless display for New Zealand's National Health Index (NHI) Number.
    // Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHI_Number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- AotearoaNationalHealthIndexView.vue -->
    <span
        class="aotearoa-national-health-index-view"
        :aria-label="label">{{ value }}</span
    >
</template>
