<script setup lang="ts">

    // PortugalNumeroDeIdentificacaoFiscalInput component
    //
    // A headless input for entering Portugal's Número de Identificação Fiscal (NIF).
    // Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

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
    <!-- PortugalNumeroDeIdentificacaoFiscalInput.vue -->
    <input
        class="portugal-numero-de-identificacao-fiscal-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
