<script setup lang="ts">

    // ItaliaCodiceFiscaleView component
    //
    // A headless display for Italy's Codice fiscale (CF).
    // Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Italian_fiscal_code

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- ItaliaCodiceFiscaleView.vue -->
    <span
        class="italia-codice-fiscale-view"
        :aria-label="label">{{ value }}</span
    >
</template>
