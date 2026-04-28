<script setup lang="ts">

    // Blockquote component
    //
    // A block-level quotation with optional source citation. Renders the native
    // <blockquote> element with optional `cite` attribute (source URL) and
    // optional visible attribution text rendered inside a <footer>.
    //
    // Props:
    //   cite          — string, optional. URL of the source (rendered as cite attribute).
    //   citationText  — string, optional. Visible attribution text.
    //   label         — string, optional. aria-label override.
    //   default slot  — quote content.
    //
    // Syntax:
    //   <Blockquote cite="https://example.com" citation-text="— Author">
    //     The quote text.
    //   </Blockquote>
    //
    // Accessibility:
    //   - Implicit <blockquote> semantics
    //   - Optional aria-label
    //
    // Internationalization:
    //   - All text via slots and props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Inspired by Mozilla Protocol Design System

    withDefaults(defineProps<{
        /** URL of the source (cite attribute). */
        cite?: string;
        /** Visible attribution text. */
        citationText?: string;
        /** aria-label override. */
        label?: string;
    }>(), {
        cite: undefined,
        citationText: undefined,
        label: undefined,
    });

</script>

<template>
    <!-- Blockquote.vue -->
    <blockquote
        class="blockquote"
        :cite="cite"
        :aria-label="label"
    >
        <slot />
        <footer v-if="citationText" class="blockquote-citation">{{ citationText }}</footer>
    </blockquote>
</template>
