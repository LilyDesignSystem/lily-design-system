<script setup lang="ts">
// UrlInput component
//
// A headless URL input using the native HTML <input type="url"> element, which
// provides built-in URL validation and may trigger URL-specific keyboard layouts
// on mobile devices. Commonly used in profile forms, link submission pages, and
// any context where users need to enter a valid web address. The browser's
// built-in validation ensures the entered value matches URL format.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Bindable URL value; supports v-model.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <UrlInput label="Website URL" v-model />
//
// Examples:
//   <!-- Required portfolio URL -->
//   <UrlInput label="Portfolio link" v-model={portfolioUrl} required />
//
// Keyboard:
//   - None beyond native text input behavior
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
//   - Browser validates URL format including protocol on form submission
//
// References:
//   - MDN input type="url": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url

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
    <!-- UrlInput.vue -->
    <input
        class="url-input"
        type="url"
        :aria-label="label"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
