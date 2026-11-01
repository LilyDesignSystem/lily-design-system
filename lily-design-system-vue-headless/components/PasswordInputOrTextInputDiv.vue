<script setup lang="ts">
// PasswordInputOrTextInputDiv component
//
// A headless password input with an optional show/hide toggle button. It renders
// a wrapper <div> containing an <input> that dynamically switches between
// type="password" and type="text", plus a toggle button with aria-pressed state.
// Includes autocomplete="current-password" for browser password manager support.
// Commonly used in login forms, registration forms, and account settings.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the password input via aria-label.
//   value — string, default "". Current password value; bindable with v-model.
//   showToggle — boolean, default true. Whether to render the show/hide toggle button.
//   toggleLabel — string, default "Show password". Accessible label for the toggle button.
//   required — boolean, default false. Whether the input is required.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <PasswordInputOrTextInputDiv label="Password" v-model />
//
// Examples:
//   <!-- Password input with toggle (default) -->
//   <PasswordInputOrTextInputDiv label="Password" v-model />
//
//   <!-- Password input without toggle -->
//   <PasswordInputOrTextInputDiv label="Password" v-model showToggle={false} />
//
//   <!-- Custom toggle label for internationalization -->
//   <PasswordInputOrTextInputDiv label="Mot de passe" v-model toggleLabel="Afficher le mot de passe" />
//
// Keyboard:
//   - Enter/Space on the toggle button: toggles password visibility
//
// Accessibility:
//   - aria-label on the input provides the accessible name
//   - aria-label on the toggle button describes its purpose
//   - aria-pressed on the toggle button indicates current visibility state
//   - autocomplete="current-password" enables browser password manager integration
//
// Internationalization:
//   - The label and toggleLabel props are the only user-facing strings
//   - Default toggleLabel is "Show password"; override for other locales
//   - No other hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses internal ref() for visibility; not exposed as a prop
//   - restProps spread onto the wrapper <div>, not the <input>
//
// References:
//   - HTML password input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
//   - WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        label: string;
        showToggle?: boolean;
        toggleLabel?: string;
        required?: boolean;
        disabled?: boolean;
    }>(),
    {
        showToggle: true,
        toggleLabel: "Show password",
        required: false,
        disabled: false,
    },
);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);

const visible = ref(false);
</script>

<template>
    <!-- PasswordInputOrTextInputDiv.vue -->
    <div class="password-input-or-text-input-div">
        <input
            :type="visible ? 'text' : 'password'"
            :aria-label="label"
            ref="field"
            v-model="modelValue"
            :required="required"
            :disabled="disabled"
            autocomplete="current-password"
        />
        <button
            v-if="showToggle"
            type="button"
            :aria-label="toggleLabel"
            :aria-pressed="visible"
            @click="visible = !visible"
        >
            :toggleLabel="toggleLabel"
        </button>
    </div>
</template>
