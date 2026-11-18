<script setup lang="ts">
// QazaqstanZhekeSaikestendiruNomiriInput component
//
// A headless input for entering Kazakhstan's Individual Identification Number (IIN).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf

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
    "QazaqstanZhekeSaikestendiruNomiriInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- QazaqstanZhekeSaikestendiruNomiriInput.vue -->
    <input
        class="qazaqstan-zheke-saikestendiru-nomiri-input"
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
