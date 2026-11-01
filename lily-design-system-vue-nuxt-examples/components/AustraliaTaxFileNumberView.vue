<script setup lang="ts">
// AustraliaTaxFileNumberView component
//
// A headless display for Australia's Tax File Number (TFN).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Tax_file_number

withDefaults(
    defineProps<{
        label: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- AustraliaTaxFileNumberView.vue -->
    <span
        class="australia-tax-file-number-view"
        :aria-label="label"
        >{{ value }}</span
    >
</template>
