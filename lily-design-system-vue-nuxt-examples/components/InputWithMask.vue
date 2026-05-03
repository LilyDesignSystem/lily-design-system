<script setup lang="ts">

    // InputWithMask component
    //
    // An input displaying a format mask placeholder for the user to fill in
    // (e.g., "(___) ___-____" for a phone number). The mask is rendered as a
    // decorative aria-hidden span and is also exposed as data-mask on the
    // root element so consumers can position the overlay with CSS.
    //
    // Props:
    //   label       — string, REQUIRED. aria-label for the input.
    //   mask        — string, REQUIRED. Format mask text.
    //   value       — string, default "". Input value.
    //   placeholder — string, optional.
    //   disabled    — boolean, default false.
    //
    // Emits:
    //   input(event: Event) — fired on input change.
    //
    // Syntax:
    //   <InputWithMask label="Phone" mask="(___) ___-____" :value="phone" @input="onInput" />
    //
    // Accessibility:
    //   - aria-label on the <input> is the entire accessible name
    //   - mask span is aria-hidden (decorative)
    //
    // Internationalization:
    //   - All text strings come from props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label and mask are required
    //   - Mask span is rendered BEFORE the input
    //
    // References:
    //   - USWDS Input mask: https://designsystem.digital.gov/components/input-mask/

    withDefaults(defineProps<{
        /** Accessible label (REQUIRED). */
        label: string;
        /** Format mask string (REQUIRED). */
        mask: string;
        /** Input value. */
        value?: string;
        /** Placeholder text. */
        placeholder?: string;
        /** Whether the input is disabled. */
        disabled?: boolean;
    }>(), {
        value: "",
        placeholder: undefined,
        disabled: false,
    });

    defineEmits<{
        (e: "input", event: Event): void;
    }>();

</script>

<template>
    <!-- InputWithMask.vue -->
    <div
        class="input-with-mask"
        :data-mask="mask"
    >
        <span
            class="input-with-mask-display"
            aria-hidden="true"
        >{{ mask }}</span>
        <input
            class="input-with-mask-control"
            type="text"
            :aria-label="label"
            :value="value"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="$emit('input', $event)"
        />
    </div>
</template>
