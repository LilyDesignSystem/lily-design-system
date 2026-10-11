<script setup lang="ts">

    // BrasilCartaoNacionalDeSaudeView component
    //
    // A headless display for Brazil's Cartão Nacional de Saúde (CNS).
    // Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/CPF_number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- BrasilCartaoNacionalDeSaudeView.vue -->
    <span
        class="brasil-cartao-nacional-de-saude-view"
        :aria-label="label">{{ value }}</span
    >
</template>
