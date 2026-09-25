<script setup lang="ts">

    // ArgentinaCodigoUnicoDeIdentificacionLaboralInput component
    //
    // A headless input for entering Argentina's Codigo Unico de Identificacion Laboral (CUIL).
    // Format: Displayed as XX-NNNNNNNN-X: a 2-digit prefix, the 8-digit DNI number, and a Modulus-11 check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral

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
    <!-- ArgentinaCodigoUnicoDeIdentificacionLaboralInput.vue -->
    <input
        class="argentina-codigo-unico-de-identificacion-laboral-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
