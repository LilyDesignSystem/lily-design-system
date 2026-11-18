<script setup lang="ts">
// LuxembourgMatriculeView component
//
// A headless display for Luxembourg's Numero d'Identification Nationale (Matricule).
// Format: 13 digits as YYYYMMDDNNNCC: date of birth, a 3-digit sequence number, a Luhn check digit, and a Verhoeff check digit.
//
// References:
//   - https://ccss.public.lu/fr/glossaire/numero-identification-national/matricule-national.html

withDefaults(
    defineProps<{
        label?: string;
        value?: string;
    }>(),
    {
        value: "",
    },
);
</script>

<template>
    <!-- LuxembourgMatriculeView.vue -->
    <span class="luxembourg-matricule-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
