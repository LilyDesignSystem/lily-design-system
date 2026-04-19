<script setup lang="ts">

    // CheckboxInput component
    //
    // A minimal headless wrapper around the native HTML <input type="checkbox">
    // element. Unlike the Checkbox component which includes a wrapping <label>,
    // CheckboxInput uses aria-label for accessibility, giving consumers full control
    // over label placement and visual presentation. Ideal for custom layouts where
    // the label position, custom indicators, or complex form integration requires
    // consumer control.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   checked — boolean, default false, bindable. Whether the checkbox is checked.
    //   label — string, required. Accessible name applied via aria-label.
    //   disabled — boolean, default false. Whether the checkbox is disabled.
    //   required — boolean, default false. Whether the checkbox is required for form submission.
    //   name — string, optional. Form field name attribute.
    //   id — string, optional. Element id attribute.
    //   value — string, optional. Value attribute for form submission.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <CheckboxInput label="Accept terms" v-model />
    //
    // Examples:
    //   <!-- Checkbox with external label -->
    //   <CheckboxInput label="Subscribe to newsletter" v-model={subscribed} disabled={!hasEmail} />
    //
    //   <!-- Required checkbox in a form -->
    //   <CheckboxInput label="Required field" v-model required name="agree" value="yes" />
    //
    // Keyboard:
    //   - Space: Toggle the checkbox checked state (native browser behavior)
    //   - Tab: Move focus to and from the checkbox (native browser behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name since there is no visible <label> element
    //   - Implicit checkbox role from <input type="checkbox">
    //
    // Internationalization:
    //   - Label text comes through the label prop; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses aria-label instead of <label> — consumer provides their own visible label
    //   - Uses defineModel() for two-way checked state binding
    //
    // References:
    //   - MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
    //   - WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

    withDefaults(defineProps<{
        label: string;
        disabled?: boolean;
        required?: boolean;
        name?: string;
        id?: string;
        value?: string;
    }>(), {
        disabled: false,
        required: false,
        name: undefined,
        id: undefined,
        value: undefined,
    });

    const checked = defineModel<boolean>("checked", { default: false });

</script>

<template>
    <!-- CheckboxInput.vue -->
    <input
        class="checkbox-input"
        type="checkbox"
        v-model="checked"
        :aria-label="label"
        :disabled="disabled"
        :required="required"
        :name="name"
        :id="id"
        :value="value"
    />
</template>
