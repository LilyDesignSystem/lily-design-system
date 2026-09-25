<script setup lang="ts">

    // MexicoClaveUnicaDeRegistroDePoblacionInput component
    //
    // A headless input for entering Mexico's Clave Única de Registro de Población (CURP).
    // Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

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
    <!-- MexicoClaveUnicaDeRegistroDePoblacionInput.vue -->
    <input
        class="mexico-clave-unica-de-registro-de-poblacion-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
