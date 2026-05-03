<script setup lang="ts">

    // PasswordInput component
    //
    // A headless password input using the native HTML <input type="password">
    // element. Renders a single password field with obscured text entry and
    // browser password manager integration via autocomplete. Unlike
    // PasswordInputOrTextInputDiv, this component renders only the bare <input> element
    // without a wrapper or toggle button. Commonly used in login forms,
    // registration forms, and account settings.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Bindable password value; supports v-model.
    //   autocomplete — string, default "current-password". Autocomplete hint for browsers.
    //   required — boolean, default false. Whether the field is required.
    //   disabled — boolean, default false. Whether the field is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <PasswordInput label="Password" v-model />
    //
    // Examples:
    //   <!-- Required password field -->
    //   <PasswordInput label="Password" v-model required />
    //
    //   <!-- New password with autocomplete hint -->
    //   <PasswordInput label="New password" v-model autocomplete="new-password" />
    //
    //   <!-- Disabled password field -->
    //   <PasswordInput label="Password" v-model disabled />
    //
    // Keyboard:
    //   - None beyond native input behavior -- standard text editing keys
    //
    // Accessibility:
    //   - aria-label={label} provides an accessible name since no visible <label> is included
    //   - autocomplete attribute enables browser password manager integration
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses defineModel() for two-way data binding on value
    //   - Consumer can add placeholder, maxlength, pattern via restProps
    //
    // References:
    //   - MDN input type="password": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password

    withDefaults(defineProps<{
        /** Accessible label. */
        label: string;
        /** Autocomplete hint for browsers. */
        autocomplete?: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        autocomplete: "current-password",
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- PasswordInput.vue -->
    <input
        class="password-input"
        type="password"
        :aria-label="label"
        v-model="modelValue"
        :autocomplete="autocomplete"
        :required="required"
        :disabled="disabled"
    />
</template>
