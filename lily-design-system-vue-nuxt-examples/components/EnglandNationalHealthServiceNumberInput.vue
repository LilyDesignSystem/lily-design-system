<script setup lang="ts">

    // EnglandNationalHealthServiceNumberInput component
    //
    // A headless input for entering England's National Health Service Number (NHS).
    // Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHS_number

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
    <!-- EnglandNationalHealthServiceNumberInput.vue -->
    <input
        class="england-national-health-service-number-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
