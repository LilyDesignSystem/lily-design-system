<script setup lang="ts">

    // EspanaCodigoDeIdentificacionFiscalInput component
    //
    // A headless input for entering Spain's Código de Identificación Fiscal (CIF).
    // Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/VAT_identification_number#Spain

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
    <!-- EspanaCodigoDeIdentificacionFiscalInput.vue -->
    <input
        class="espana-codigo-de-identificacion-fiscal-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
