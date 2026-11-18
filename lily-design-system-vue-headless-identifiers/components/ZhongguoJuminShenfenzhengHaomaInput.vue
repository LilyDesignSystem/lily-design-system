<script setup lang="ts">
// ZhongguoJuminShenfenzhengHaomaInput component
//
// A headless input for entering China's Resident Identity Card Number.
// Format: 18 characters under GB 11643: region code, date of birth (YYYYMMDD), a sequence number encoding sex by parity, and an ISO 7064 MOD 11-2 check character (X for 10).
//
// References:
//   - https://en.wikipedia.org/wiki/Resident_Identity_Card

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
    "ZhongguoJuminShenfenzhengHaomaInput",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- ZhongguoJuminShenfenzhengHaomaInput.vue -->
    <input
        class="zhongguo-jumin-shenfenzheng-haoma-input"
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
