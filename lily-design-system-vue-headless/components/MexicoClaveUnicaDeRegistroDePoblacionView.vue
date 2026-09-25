<script setup lang="ts">

    // MexicoClaveUnicaDeRegistroDePoblacionView component
    //
    // A headless display for Mexico's Clave Única de Registro de Población (CURP).
    // Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_Population_Registry_Code

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- MexicoClaveUnicaDeRegistroDePoblacionView.vue -->
    <span
        class="mexico-clave-unica-de-registro-de-poblacion-view"
        :aria-label="label">{{ value }}</span
    >
</template>
