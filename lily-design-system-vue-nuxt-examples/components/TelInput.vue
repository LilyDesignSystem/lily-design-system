<script setup lang="ts">
// TelInput component
//
// A headless telephone input using the native HTML <input type="tel"> element.
// Provides accessible labeling via aria-label and browser autofill support via
// autocomplete="tel". Commonly used in contact forms, registration flows, and
// profile editors. Supports two-way data binding through a bindable value prop.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the input via aria-label.
//   value — string, default "". Bindable telephone number value.
//   required — boolean, default false. Whether the field is required for form submission.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TelInput label="Phone number" v-model />
//
// Examples:
//   <!-- Required phone input -->
//   <TelInput label="Mobile" v-model required />
//
// Keyboard:
//   - Native <input type="tel"> keyboard behavior (Tab to focus, type to enter digits)
//
// Accessibility:
//   - aria-label provides the accessible name for the input
//   - autocomplete="tel" enables browser and password manager autofill
//   - required and disabled states are conveyed to assistive technology
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses defineModel() for two-way data binding on value
//   - Consumer can add placeholder, pattern, maxlength via restProps
//
// References:
//   - HTML tel input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        /** Accessible name for the telephone input */
        label: string;
        /** Whether the input is required */
        required?: boolean;
        /** Whether the input is disabled */
        disabled?: boolean;
    }>(),
    {
        required: false,
        disabled: false,
    },
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- TelInput.vue -->
    <input
        class="tel-input"
        type="tel"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
        autocomplete="tel"
        :required="required"
        :disabled="disabled"
    />
</template>
