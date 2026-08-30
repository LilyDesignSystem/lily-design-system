<script setup lang="ts">

    // ItaliaCodiceFiscaleInput component
    //
    // A headless input for entering Italy's Codice fiscale (CF).
    // Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Italian_fiscal_code

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
    <!-- ItaliaCodiceFiscaleInput.vue -->
    <input
        class="italia-codice-fiscale-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
