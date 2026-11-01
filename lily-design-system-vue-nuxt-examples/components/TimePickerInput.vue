<script setup lang="ts">
// TimePickerInput component
//
// A headless time picker that wraps a native <input type="time"> element,
// allowing users to select a specific time of day. Often used alongside date
// pickers in forms, scheduling tools, or booking systems. The native input
// handles 12-hour/24-hour format based on the browser locale. Supports
// two-way data binding and standard form validation attributes.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current time value in HH:MM format; bindable with v-model.
//   required — boolean, default false. Whether a value is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <TimePickerInput label="Appointment time" v-model />
//
// Examples:
//   <!-- Required departure time picker -->
//   <TimePickerInput label="Departure time" v-model required />
//
// Keyboard:
//   - Tab: move focus to/from the time input
//   - ArrowUp/ArrowDown: increment/decrement the focused time segment
//   - ArrowLeft/ArrowRight: move between time segments
//
// Accessibility:
//   - aria-label={label} provides an accessible name for the time input
//
// Internationalization:
//   - The label prop accepts any translated string
//   - Time format is locale-dependent via native browser behavior
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses defineModel() for two-way data binding on value
//
// References:
//   - MDN input type="time": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
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

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- TimePickerInput.vue -->
    <input
        class="time-picker-input"
        type="time"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
