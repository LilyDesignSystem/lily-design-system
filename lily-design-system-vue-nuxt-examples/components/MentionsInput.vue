<script setup lang="ts">

    // MentionsInput component
    //
    // A text input with at-mention autocomplete suggestions. Renders a wrapper
    // <div>, an inner <input> with combobox semantics, and a suggestions panel
    // populated by the consumer through the default slot. The trigger character
    // (usually "@") is exposed via `data-trigger-char`.
    //
    // Props:
    //   label       — string, REQUIRED. aria-label for the input.
    //   value       — string, default "". Input value.
    //   triggerChar — string, default "@". Character that opens suggestions.
    //   expanded    — boolean, default false. Whether the suggestions panel is open.
    //   placeholder — string, optional.
    //   disabled    — boolean, default false.
    //   default slot — suggestions panel content (typically a Listbox).
    //   emits input(event) — input change handler.
    //
    // Syntax:
    //   <MentionsInput label="Reply" :value="text" :expanded="open" @input="onInput">
    //     <ul role="listbox">…</ul>
    //   </MentionsInput>
    //
    // Accessibility:
    //   - Inner input has role="combobox", aria-haspopup="listbox",
    //     aria-expanded, aria-autocomplete="list".
    //
    // Internationalization:
    //   - All text content (label, placeholder, value) is consumer-supplied.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required — non-optional in the interface
    //
    // References:
    //   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
    //   - Ant Design Mentions: https://ant.design/components/mentions

    withDefaults(defineProps<{
        /** Accessible label (REQUIRED). */
        label: string;
        /** Input value. */
        value?: string;
        /** Character that opens the suggestions panel. */
        triggerChar?: string;
        /** Whether the suggestions panel is open. */
        expanded?: boolean;
        /** Placeholder text. */
        placeholder?: string;
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        value: "",
        triggerChar: "@",
        expanded: false,
        placeholder: undefined,
        disabled: false,
    });

    defineEmits<{
        (e: "input", event: Event): void;
    }>();

</script>

<template>
    <!-- MentionsInput.vue -->
    <div
        class="mentions-input"
        :data-trigger-char="triggerChar"
    >
        <input
            class="mentions-input-control"
            type="text"
            role="combobox"
            :aria-label="label"
            aria-haspopup="listbox"
            :aria-expanded="expanded"
            aria-autocomplete="list"
            :value="value"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="$emit('input', $event)"
        >
        <div
            class="mentions-input-suggestions"
            :hidden="!expanded"
        >
            <slot />
        </div>
    </div>
</template>
