<script setup lang="ts">
// EmailInput component
//
// A headless email input wrapping a native <input type="email"> with accessible
// labeling. Provides a streamlined API for basic email collection with required
// and disabled state support.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — string, default "". Current email value; bindable.
//   required — boolean, default false. Whether the field is required.
//   disabled — boolean, default false. Whether the field is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <EmailInput label="Your email" v-model />
//
// Examples:
//   <!-- Basic email input -->
//   <EmailInput label="Your email" v-model />
//
//   <!-- Required email field -->
//   <EmailInput label="Contact email" v-model required />
//
// Keyboard:
//   - None custom — keyboard behavior provided by the browser-native email input
//
// Accessibility:
//   - aria-label provides the accessible name since no visible <label> is included
//   - Native <input type="email"> provides built-in validation
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses defineModel() on value for two-way binding
//
// References:
//   - MDN input type="email": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email

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
    <input
        class="email-input"
        type="email"
        :aria-label="label"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
