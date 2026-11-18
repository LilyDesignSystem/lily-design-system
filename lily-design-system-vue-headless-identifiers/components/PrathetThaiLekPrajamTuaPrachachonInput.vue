<script setup lang="ts">
// PrathetThaiLekPrajamTuaPrachachonInput component
//
// A headless input for entering Thailand's National Identification Number.
// Format: 13 digits: registration category, district/province office code, a serial number, a Modulus-11 check digit, and 2 further disambiguating digits.
//
// References:
//   - https://en.wikipedia.org/wiki/Thai_identity_card

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
    "PrathetThaiLekPrajamTuaPrachachonInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- PrathetThaiLekPrajamTuaPrachachonInput.vue -->
    <input
        class="prathet-thai-lek-prajam-tua-prachachon-input"
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
