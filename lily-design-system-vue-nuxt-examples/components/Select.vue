<script setup lang="ts">
// Select component
//
// A headless wrapper around the native HTML <select> element for choosing one
// option from a dropdown list. The consumer provides <option> elements as
// children, giving full control over available choices. Commonly used in forms
// for selecting countries, categories, statuses, or other predefined values.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Currently selected value; bindable with v-model.
//   required — boolean, default false. Whether the select is required for form submission.
//   disabled — boolean, default false. Whether the select is disabled.
//   default slot. <option> elements to render inside the select.
//   ...restProps — additional HTML attributes spread onto the <select>.
//
// Syntax:
//   <Select label="Country" v-model>
//     <option value="us">United States</option>
//   </Select>
//
// Examples:
//   <!-- Required select with placeholder -->
//   <Select label="Priority" v-model={priority} required>
//     <option value="">Select priority...</option>
//     <option value="low">Low</option>
//     <option value="high">High</option>
//   </Select>
//
//   <!-- Disabled select -->
//   <Select label="Status" v-model disabled={isReadOnly}>
//     <option value="active">Active</option>
//     <option value="inactive">Inactive</option>
//   </Select>
//
// Keyboard:
//   - Tab: moves focus to/from the select (native browser behavior)
//   - Space/Enter: opens the dropdown list (native browser behavior)
//   - Arrow Up/Down: navigates through options (native browser behavior)
//   - Escape: closes the dropdown list (native browser behavior)
//   - Home/End: jumps to first/last option (native browser behavior)
//   - Type-ahead: typing characters jumps to matching options (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name since there is no visible <label> element
//   - Native <select> has implicit combobox/listbox role with built-in semantics
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//   - Option text is provided by the consumer via default slot
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses defineModel() for two-way binding with v-model
//   - Children slot renders <option> elements inside the native <select>
//
// References:
//   - MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

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
    <!-- Select.vue -->
    <select
        class="select"
        :aria-label="label"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    >
        <slot />
    </select>
</template>
