<script setup lang="ts">
// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput component
//
// A headless input for entering Uzbekistan's Personal identification number (JShShIR / PINFL).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl

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
    "OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput.vue -->
    <input
        class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input"
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
