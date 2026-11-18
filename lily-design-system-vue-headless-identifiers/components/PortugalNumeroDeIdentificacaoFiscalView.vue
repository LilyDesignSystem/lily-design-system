<script setup lang="ts">
// PortugalNumeroDeIdentificacaoFiscalView component
//
// A headless display for Portugal's Número de Identificação Fiscal (NIF).
// Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).
//
// References:
//   - https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)

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
    <!-- PortugalNumeroDeIdentificacaoFiscalView.vue -->
    <span class="portugal-numero-de-identificacao-fiscal-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
