<script setup lang="ts">

    // LuxembourgMatriculeInput component
    //
    // A headless input for entering Luxembourg's Numero d'Identification Nationale (Matricule).
    // Format: 13 digits as YYYYMMDDNNNCC: date of birth, a 3-digit sequence number, a Luhn check digit, and a Verhoeff check digit.
    //
    // References:
    //   - https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html

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
    <!-- LuxembourgMatriculeInput.vue -->
    <input
        class="luxembourg-matricule-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
