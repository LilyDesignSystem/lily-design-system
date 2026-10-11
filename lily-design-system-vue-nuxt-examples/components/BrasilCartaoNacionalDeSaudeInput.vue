<script setup lang="ts">

    // BrasilCartaoNacionalDeSaudeInput component
    //
    // A headless input for entering Brazil's Cartão Nacional de Saúde (CNS).
    // Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/CPF_number

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
    <!-- BrasilCartaoNacionalDeSaudeInput.vue -->
    <input
        class="brasil-cartao-nacional-de-saude-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
