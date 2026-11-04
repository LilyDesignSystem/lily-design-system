<script setup lang="ts">
// BulgariaEdinenGrazhdanskiNomerInput component
//
// A headless input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN).
// Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.
//
// References:
//   - https://en.wikipedia.org/wiki/Unique_citizenship_number

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
    "BulgariaEdinenGrazhdanskiNomerInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- BulgariaEdinenGrazhdanskiNomerInput.vue -->
    <input
        class="bulgaria-edinen-grazhdanski-nomer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
