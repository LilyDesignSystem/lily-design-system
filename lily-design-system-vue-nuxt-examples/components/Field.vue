<script setup lang="ts">

    // Field component
    //
    // A form field wrapper that combines a label, description, and error message
    // with proper labelling via the for attribute and accessible error announcements.
    // Works with any input type: text inputs, selects, textareas, checkboxes, and
    // more. Auto-generates IDs for linking the label to its input and for associating
    // description and error elements via ARIA attributes.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Visible label text.
    //   description — string, default undefined. Helper text displayed below the label.
    //   error — string, default undefined. Error message displayed below the input.
    //   required — boolean, default false. Adds a visual asterisk (hidden from screen readers).
    //   inputId — string, default undefined. ID of the input to link the label to; auto-generated if omitted.
    //   default slot. Form control (input, select, textarea, etc.).
    //   ...restProps — additional HTML attributes spread onto the outer <div>.
    //
    // Syntax:
    //   <Field label="Name"><input id="name-input" /></Field>
    //
    // Examples:
    //   <!-- Field with description -->
    //   <Field label="Name" description="Enter full name">
    //     <input id="name-input" />
    //   </Field>
    //
    //   <!-- Required field with error -->
    //   <Field label="Email" required error="Email is required">
    //     <input id="email-input" type="email" />
    //   </Field>
    //
    // Keyboard:
    //   - None — passive container; clicking the label focuses the associated input via native for attribute
    //
    // Accessibility:
    //   - <label for={fieldId}> links the visible label to the input element
    //   - role="alert" on the error paragraph announces errors to screen readers
    //   - aria-hidden="true" on the required asterisk prevents screen reader noise
    //   - data-required attribute on wrapper for consumer CSS styling
    //
    // Internationalization:
    //   - The label, description, and error props accept any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Auto-generates IDs using computed() if inputId is not provided
    //   - Derives descId and errorId from the field ID for ARIA linking
    //
    // References:
    //   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
    //   - WAI-ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21

    import { computed, useId } from "vue";

    const props = withDefaults(defineProps<{
        /** Visible label text. */
        label: string;
        /** Helper description. */
        description?: string;
        /** Error message. */
        error?: string;
        /** Whether the field is required. */
        required?: boolean;
        /** ID of the input to link the label to. */
        inputId?: string;
    }>(), {
        description: undefined,
        error: undefined,
        required: false,
        inputId: undefined,
    });

    const fieldId = computed(() =>
        props.inputId ?? generatedId,
    );

    const descId = computed(() =>
        `${fieldId.value}-desc`,
    );

    const errorId = computed(() =>
        `${fieldId.value}-error`,
    );

    const generatedId = `field-${useId()}`;

</script>

<template>
    <div
        class="field"
        :data-required="required || undefined"
    >
        <label :for="fieldId"
            >{{ label }}<span v-if="required" aria-hidden="true"> *</span></label
        >
                <p v-if="description" :id="descId">{{ description }}</p>
        <slot />
                <p v-if="error"
                :id="errorId"
                role="alert"
            >{{ error }}</p>
    </div>
</template>
