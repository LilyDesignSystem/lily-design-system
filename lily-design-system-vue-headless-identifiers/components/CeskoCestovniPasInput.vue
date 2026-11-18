<script setup lang="ts">
// CeskoCestovniPasInput component
//
// A headless input for entering Czech Republic's Cestovní pas.
// Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.
//
// References:
//   - https://en.wikipedia.org/wiki/Czech_passport

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
    "CeskoCestovniPasInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- CeskoCestovniPasInput.vue -->
    <input
        class="cesko-cestovni-pas-input"
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
