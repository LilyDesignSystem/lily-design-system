<script setup lang="ts">
// IbanView component
//
// A headless display for an International Bank Account Number (IBAN).
// Format: Up to 34 letters and digits: a two-letter country code, two check digits, then the national account number.
//
// References:
//   - https://en.wikipedia.org/wiki/International_Bank_Account_Number

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
    <!-- IbanView.vue -->
    <span
        class="iban-view"
        :aria-label="label"
        >{{ value }}</span
    >
</template>
