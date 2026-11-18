<script setup lang="ts">
// PeruDocumentoNacionalDeIdentidadInput component
//
// A headless input for entering Peru's Documento Nacional de Identidad (DNI).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)

import { ref, useAttrs } from "vue";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        label: string;
        required?: boolean;
        disabled?: boolean;
    }>(),
    {
        required: false,
        disabled: false,
    },
);

warnMissingName(
    "PeruDocumentoNacionalDeIdentidadInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- PeruDocumentoNacionalDeIdentidadInput.vue -->
    <input
        class="peru-documento-nacional-de-identidad-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        spellcheck="false"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
