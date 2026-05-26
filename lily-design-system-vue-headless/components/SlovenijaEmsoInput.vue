<script setup lang="ts">

    // SlovenijaEmsoInput component
    //
    // A headless input for entering Slovenia's Enotna Matična Številka Občana (EMŠO).
    // Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

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
    <!-- SlovenijaEmsoInput.vue -->
    <input
        class="slovenija-emso-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
