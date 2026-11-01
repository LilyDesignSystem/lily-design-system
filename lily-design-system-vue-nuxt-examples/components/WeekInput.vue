<script setup lang="ts">
// WeekInput component
//
// A headless week input using the native HTML <input type="week"> element.
// Renders a week picker control for selecting a specific week of the year,
// with values in ISO 8601 YYYY-Www format (e.g., "2024-W01"). Useful for
// scheduling applications, time tracking systems, reporting tools, and any
// scenario where data is organized by week rather than by specific date.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable week value in YYYY-Www format; supports v-model.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <WeekInput label="Select week" v-model />
//
// Examples:
//   <!-- Required report week selector -->
//   <WeekInput label="Report week" v-model={selectedWeek} required />
//
// Keyboard:
//   - ArrowUp/ArrowDown: adjust the focused segment (year or week number)
//   - ArrowLeft/ArrowRight: move between year and week segments
//   - Enter: confirm selection (native behavior, varies by browser)
//
// Accessibility:
//   - aria-label={label} provides the accessible name since no visible label is associated
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Uses defineModel() for two-way data binding on value
//   - Browser support varies; some render native picker, others fall back to text input
//
// References:
//   - MDN input type="week": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        /** Accessible label. */
        label: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
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
    <!-- WeekInput.vue -->
    <input
        class="week-input"
        type="week"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
