<script setup lang="ts">

    // ToolCallError component
    //
    // A headless inner part of ToolCall: the error shown when a tool call fails. Contract: `role="alert"` announces the error when it appears (open the tool call on error so it is not hidden inside a closed `<details>`).
    // Draws nothing and carries no strings of its own; the consumer supplies the text.

</script>

<template>
    <!-- ToolCallError.vue -->
    <div
        class="tool-call-error"
        role="alert"
    >
        <slot />
    </div>
</template>
