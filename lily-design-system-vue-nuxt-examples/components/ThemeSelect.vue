<script setup lang="ts">
// ThemeSelect component
//
// A headless theme selection control that renders a native <select> dropdown
// for choosing between visual themes or color schemes. Commonly used for
// light, dark, high-contrast, or system-default theme options. The consumer
// provides <option> elements as children and is responsible for applying the
// selected theme value to the page.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable selected theme; supports v-model.
//   default slot. ThemeSelectOption elements representing available themes.
//   ...restProps — additional HTML attributes spread onto the <select>.
//
// Syntax:
//   <ThemeSelect label="Theme" v-model>...</ThemeSelect>
//
// Examples:
//   <!-- theme select with multiple schemes -->
//   <ThemeSelect label="Color scheme" v-model={theme}>
//     <ThemeSelectOption value="light">Light</ThemeSelectOption>
//     <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
//     <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
//     <ThemeSelectOption value="system">System Default</ThemeSelectOption>
//   </ThemeSelect>
//
// Keyboard:
//   - Tab: moves focus to the select element (native behavior)
//   - Space/Enter: opens the dropdown (native behavior)
//   - ArrowUp/ArrowDown: navigates through options (native behavior)
//   - Escape: closes the dropdown (native behavior)
//
// Accessibility:
//   - aria-label={label} provides an accessible name since no visible <label> is included
//
// Internationalization:
//   - The label prop accepts any translated string
//   - Option text is consumer-provided and can be localized
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Consumer applies the selected theme value to the page
//   - Uses defineModel() for two-way data binding on value
//
// References:
//   - MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
//   - WCAG 1.4.12 Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html

import { ref } from "vue";
import { useFormReset } from "./form-reset";

defineProps<{
    /** Accessible label. */
    label: string;
}>();

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLSelectElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- ThemeSelect.vue -->
    <select
        class="theme-select"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
    >
        <slot />
    </select>
</template>
