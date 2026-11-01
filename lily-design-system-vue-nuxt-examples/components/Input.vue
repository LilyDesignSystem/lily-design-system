<script setup lang="ts">
// Input component
//
// A foundational form input component for text entry with accessible labeling and
// two-way value binding. Renders a native <input> element supporting various HTML
// input types such as text, email, password, number, search, and more. Provides
// required and disabled attributes and spreads additional props for full consumer control.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   value — string, default "". Bindable current input value via v-model.
//   type — string, default "text". HTML input type attribute (e.g., "text", "email", "password", "number").
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the input element.
//
// Syntax:
//   <Input label="Search" v-model />
//
// Examples:
//   <!-- Basic text input -->
//   <Input label="Search" v-model />
//
//   <!-- Required name input -->
//   <Input label="Name" v-model type="text" required />
//
//   <!-- Email input with disabled state -->
//   <Input label="Email address" v-model type="email" required disabled={isSubmitting} />
//
// Keyboard:
//   - Tab: Focus the input (native browser behavior)
//   - Standard text editing keys are supported natively
//
// Accessibility:
//   - aria-label provides an accessible name since there is no built-in visible <label> element
//   - Consumer can add aria-describedby for linked hint text
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses defineModel() for two-way binding of the input text
//   - Consumer can pass placeholder, maxlength, pattern, etc. via restProps
//
// References:
//   - MDN Input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        label: string;
        type?: string;
        required?: boolean;
        disabled?: boolean;
    }>(),
    {
        type: "text",
        required: false,
        disabled: false,
    },
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- Input.vue -->
    <input
        class="input"
        :type="type"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
