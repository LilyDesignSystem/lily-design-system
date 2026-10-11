<script setup lang="ts">

    // ToolCallInput component
    //
    // A headless inner part of ToolCall: the input or arguments passed to a tool in a tool call. Contract: `label` (optional) sets `role="group"` and `aria-label`; without it neither is rendered.
    // Draws nothing and carries no strings of its own; the consumer supplies the text.
    defineProps<{
        /** Accessible name of the group. */
        label?: string;
    }>();

</script>

<template>
    <!-- ToolCallInput.vue -->
    <div
        class="tool-call-input"
        :role="label ? 'group' : undefined"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
