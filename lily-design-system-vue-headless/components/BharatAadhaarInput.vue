<script setup lang="ts">

    // BharatAadhaarInput component
    //
    // A headless input for entering India's Aadhaar (आधार).
    // Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Aadhaar

    withDefaults(defineProps<{
        label: string;
        required?: boolean;
        disabled?: boolean;
    }>(), {
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- BharatAadhaarInput.vue -->
    <input
        class="bharat-aadhaar-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
