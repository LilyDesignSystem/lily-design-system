<script setup lang="ts">
// RedAmberGreenPicker component
//
// A headless RAG (Red/Amber/Green) status input that renders a native
// <select> element with three traffic-light options: red, amber, and green.
// RAG status is widely used in project management dashboards, risk registers,
// and reporting tools to communicate health at a glance.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the select element.
//   value — string, default "". Currently selected status value; bindable.
//   ...restProps — additional HTML attributes spread onto the <select>.
//
// Syntax:
//   <RedAmberGreenPicker label="Project status" v-model={status} />
//
// Examples:
//   <!-- Pre-selected value -->
//   <RedAmberGreenPicker label="Health check" value="green" />
//
//   <!-- Two-way binding with state -->
//   <RedAmberGreenPicker label="Sprint status" v-model={status} data-project="alpha" />
//
// Keyboard:
//   - Arrow Up/Down: navigate options (native select behavior)
//   - Enter/Space: open the dropdown (native select behavior)
//   - Escape: close the dropdown (native select behavior)
//
// Accessibility:
//   - aria-label on the <select> for screen reader context
//   - Native <select> provides implicit combobox/listbox role
//   - WCAG 2.2 AAA: properly labeled for assistive technology
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//   - Option display text ("Red", "Amber", "Green") is hardcoded; wrap or fork to localize
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses defineModel() for two-way binding with v-model
//   - Options are fixed to the three RAG values: red, amber, green
//
// References:
//   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

defineProps<{
    /** Accessible label for the select element */
    label: string;
}>();

const modelValue = defineModel<string>({ default: "" });
</script>

<template>
    <!-- RedAmberGreenPicker.vue -->
    <select
        class="red-amber-green-picker"
        :aria-label="label"
        v-model="modelValue"
    >
        <option value="red">Red</option>
        <option value="amber">Amber</option>
        <option value="green">Green</option>
    </select>
</template>
