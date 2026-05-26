<script setup lang="ts">

    // SlovenskoRodneCisloInput component
    //
    // A headless input for entering Slovakia's Rodné číslo (RČ).
    // Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Slovakia

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
    <!-- SlovenskoRodneCisloInput.vue -->
    <input
        class="slovensko-rodne-cislo-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
