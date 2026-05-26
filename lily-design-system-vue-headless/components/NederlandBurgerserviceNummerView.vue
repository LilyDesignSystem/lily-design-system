<script setup lang="ts">

    // NederlandBurgerserviceNummerView component
    //
    // A headless display for Netherlands's Burgerservicenummer (BSN).
    // Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Burgerservicenummer

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- NederlandBurgerserviceNummerView.vue -->
    <span
        class="nederland-burgerservice-nummer-view"
        :aria-label="label">{{ value }}</span
    >
</template>
