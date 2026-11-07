<script setup lang="ts">
// VietNamCanCuocCongDanInput component
//
// A headless input for entering Viet Nam's Citizen Identification Number (CCCD).
// Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Vietnamese_identity_card

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
    "VietNamCanCuocCongDanInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- VietNamCanCuocCongDanInput.vue -->
    <input
        class="viet-nam-can-cuoc-cong-dan-input"
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
