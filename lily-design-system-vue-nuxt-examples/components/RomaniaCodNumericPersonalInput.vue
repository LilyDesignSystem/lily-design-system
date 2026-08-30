<script setup lang="ts">

    // RomaniaCodNumericPersonalInput component
    //
    // A headless input for entering Romania's Cod Numeric Personal (CNP).
    // Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Romania

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
    <!-- RomaniaCodNumericPersonalInput.vue -->
    <input
        class="romania-cod-numeric-personal-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
