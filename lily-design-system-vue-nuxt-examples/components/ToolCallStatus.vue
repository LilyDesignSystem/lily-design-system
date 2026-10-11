<script setup lang="ts">

    // ToolCallStatus component
    //
    // A headless inner part of ToolCall: the status of a tool call as a word, such as pending, running, done or error. Contract: `status` (optional) sets `data-status`; the visible status word is the children (consumer text, never colour alone).
    // Draws nothing and carries no strings of its own; the consumer supplies the text.
    defineProps<{
        /** Status: pending, running, done or error. */
        status?: string;
    }>();

</script>

<template>
    <!-- ToolCallStatus.vue -->
    <span
        class="tool-call-status"
        :data-status="status"
    >
        <slot />
    </span>
</template>
