<script setup lang="ts">

    // CeskoRodneCisloInput component
    //
    // A headless input for entering Czech Republic's Rodné číslo (RČ).
    // Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic

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
    <!-- CeskoRodneCisloInput.vue -->
    <input
        class="cesko-rodne-cislo-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
