<script setup lang="ts">

    // ElladaDematerialisedSecuritiesSystemView component
    //
    // A headless display for Greece's Dematerialised Securities System (DSS).
    // Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Central_Securities_Depository

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- ElladaDematerialisedSecuritiesSystemView.vue -->
    <span
        class="ellada-dematerialised-securities-system-view"
        :aria-label="label">{{ value }}</span
    >
</template>
