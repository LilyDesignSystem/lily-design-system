<script setup lang="ts">

    // LiechtensteinPassportNumberView component
    //
    // A headless display for Liechtenstein's Liechtenstein Passport Number.
    // Format: 1 letter followed by 5 digits (e.g. R00536).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Liechtenstein_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- LiechtensteinPassportNumberView.vue -->
    <span
        class="liechtenstein-passport-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
