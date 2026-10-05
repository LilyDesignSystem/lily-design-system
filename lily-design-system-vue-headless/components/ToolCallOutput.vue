<script setup lang="ts">

    // ToolCallOutput component
    //
    // A headless inner part of ToolCall: the output or result returned by a tool in a tool call. Contract: `label` (optional) sets `role="group"` and `aria-label`; without it neither is rendered.
    // Draws nothing and carries no strings of its own; the consumer supplies the text.
    defineProps<{
        /** Accessible name of the group. */
        label?: string;
    }>();

</script>

<template>
    <!-- ToolCallOutput.vue -->
    <div
        class="tool-call-output"
        :role="label ? 'group' : undefined"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
