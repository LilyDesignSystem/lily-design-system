<script setup lang="ts">

    // TextAreaWithCharacterCounter component
    //
    // A headless component that wraps a native <textarea> and a character counter
    // caption inside a <div>. The counter displays "[number] of [maximum] characters"
    // below the textarea and updates reactively as the user types.
    //
    // Props:
    //   label — string, required. Accessible name for the textarea via aria-label.
    //   maxLength — number, required. Maximum number of characters allowed.
    //   counterTemplate — string, default "{count} of {max} characters". Counter text template.
    //   rows — number, optional. Number of visible text rows.
    //   placeholder — string, optional. Placeholder text for the textarea.
    //   required — boolean, default false. Whether the textarea is required.
    //   disabled — boolean, default false. Whether the textarea is disabled.
    //
    // Models:
    //   modelValue — string, default "". Bindable textarea value.
    //
    // Syntax:
    //   <TextAreaWithCharacterCounter label="Feedback" :maxLength="500" v-model="text" />
    //
    // Keyboard:
    //   - Tab: Focus the textarea (native browser behavior)
    //   - Standard textarea keyboard interactions
    //
    // Accessibility:
    //   - aria-label on the textarea provides accessible name
    //   - aria-describedby links textarea to the counter
    //   - aria-live="polite" on counter announces updates to screen readers
    //
    // Internationalization:
    //   - counterTemplate prop allows full customization of counter text
    //   - {count} and {max} placeholders are replaced with actual values
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        label: string;
        maxLength: number;
        counterTemplate?: string;
        rows?: number;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
    }>(), {
        counterTemplate: "{count} of {max} characters",
        rows: undefined,
        placeholder: undefined,
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

    const counterId = `counter-${Math.random().toString(36).slice(2, 9)}`;

    const counterText = computed(() =>
        props.counterTemplate
            .replace("{count}", String(modelValue.value.length))
            .replace("{max}", String(props.maxLength))
    );

</script>

<template>
    <!-- TextAreaWithCharacterCounter.vue -->
    <div
        class="text-area-with-character-counter"
    >
        <textarea
            :aria-label="label"
            :aria-describedby="counterId"
            v-model="modelValue"
            :maxlength="maxLength"
            :rows="rows"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
        ></textarea>
        <span
            :id="counterId"
            aria-live="polite"
        >
            {{ counterText }}
        </span>
    </div>
</template>
