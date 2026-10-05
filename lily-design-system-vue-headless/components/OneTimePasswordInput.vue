<script setup lang="ts">

    // OneTimePasswordInput component
    //
    // A headless one-time-password (OTP / SMS code) input. ONE real native
    // <input type="text"> -- not segmented boxes -- so SMS autofill
    // (autocomplete="one-time-code"), paste and password managers work.
    //
    // Props:
    //   label -- string, required. Accessible name via aria-label.
    //   length -- number, required. Number of characters; no default, the consumer decides.
    //   value -- string, default "". Bindable via v-model.
    //   inputMode -- string, default "numeric". Virtual keyboard hint.
    //   pattern -- string, default "[0-9]*". Allowed characters.
    //   name -- string, optional. Form field name.
    //   required, disabled -- boolean, default false.
    //   ...attrs -- fall through onto the <input>.
    //
    // Keyboard: none beyond native input behaviour.
    //
    // Accessibility: aria-label={label}; data-length={length} for consumer CSS.
    //
    // Internationalization: label is consumer-supplied; no hardcoded strings.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles.
    //   - Uses defineModel() for the value.

    withDefaults(defineProps<{
        /** Accessible label. */
        label: string;
        /** Number of characters in the code. */
        length: number;
        /** Virtual keyboard hint. */
        inputMode?: string;
        /** Allowed characters pattern. */
        pattern?: string;
        /** Form field name. */
        name?: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        inputMode: "numeric",
        pattern: "[0-9]*",
        name: undefined,
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- OneTimePasswordInput.vue -->
    <input
        class="one-time-password-input"
        type="text"
        :inputmode="inputMode"
        autocomplete="one-time-code"
        :maxlength="length"
        :pattern="pattern"
        :spellcheck="false"
        autocapitalize="off"
        :aria-label="label"
        :data-length="length"
        :name="name"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
