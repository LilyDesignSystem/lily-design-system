<script setup lang="ts">
// PeruDocumentoNacionalDeIdentidadView component
//
// A headless display for Peru's Documento Nacional de Identidad (DNI).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)

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
    <!-- PeruDocumentoNacionalDeIdentidadView.vue -->
    <span class="peru-documento-nacional-de-identidad-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
