<script setup lang="ts">

    // UnitedKingdomNationalInsuranceNumberInput component
    //
    // A headless input for entering United Kingdom's National Insurance Number (NINO).
    // Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Insurance_number

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
    <!-- UnitedKingdomNationalInsuranceNumberInput.vue -->
    <input
        class="united-kingdom-national-insurance-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
