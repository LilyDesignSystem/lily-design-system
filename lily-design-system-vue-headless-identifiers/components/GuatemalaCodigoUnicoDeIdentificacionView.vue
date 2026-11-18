<script setup lang="ts">
// GuatemalaCodigoUnicoDeIdentificacionView component
//
// A headless display for Guatemala's Código Único de Identificación (CUI).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf

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
    <!-- GuatemalaCodigoUnicoDeIdentificacionView.vue -->
    <span class="guatemala-codigo-unico-de-identificacion-view"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</span
    >
</template>
