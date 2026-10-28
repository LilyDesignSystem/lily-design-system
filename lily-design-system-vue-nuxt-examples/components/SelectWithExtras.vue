<script setup lang="ts">
// SelectWithExtras component
//
// A headless enhanced select that wraps a native <select> element with optional
// content areas before and after it. Allows consumers to place supplementary
// elements such as icons, flags, status indicators, or helper text alongside
// the select without breaking its accessibility. Preserves full native select
// behavior including keyboard navigation and form submission.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the select via aria-label.
//   value — string, default "". Currently selected value; bindable with v-model.
//   required — boolean, default false. Whether the select is required for form validation.
//   disabled — boolean, default false. Whether the select is disabled.
//   default slot. <option> elements for the select.
//   before — named slot, optional. Content rendered before the select element.
//   after — named slot, optional. Content rendered after the select element.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <SelectWithExtras label="Country" v-model>
//     <option value="us">USA</option>
//   </SelectWithExtras>
//
// Examples:
//   <!-- With before slot for a flag icon -->
//   <SelectWithExtras label="Country" v-model>
//     <template #before><span>Flag:</span></template>
//     <option value="us">USA</option>
//     <option value="uk">United Kingdom</option>
//   </SelectWithExtras>
//
//   <!-- With after slot for a unit label -->
//   <SelectWithExtras label="Unit" v-model>
//     <template #after><span>selected</span></template>
//     <option value="kg">Kilograms</option>
//     <option value="lb">Pounds</option>
//   </SelectWithExtras>
//
// Keyboard:
//   - Tab: moves focus to the native select element
//   - Arrow Up/Down: navigates between options (native select behavior)
//   - Space/Enter: opens the dropdown (native select behavior)
//   - Escape: closes the dropdown (native select behavior)
//
// Accessibility:
//   - aria-label on the <select> provides the accessible name
//   - Native <select> semantics are fully preserved
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//   - Before/after slot content is consumer-provided for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses defineModel() for two-way binding with v-model
//   - restProps spread onto the wrapper <div>, not the <select>
//   - Before/after slots are conditionally rendered only when provided
//
// References:
//   - HTML <select> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

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
</script>

<template>
    <!-- SelectWithExtras.vue -->
    <div class="select-with-extras">
        <slot name="before" />
        <select
            :aria-label="label"
            v-model="modelValue"
            :required="required"
            :disabled="disabled"
        >
            <slot />
        </select>
        <slot name="after" />
    </div>
</template>
