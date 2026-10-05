<script setup lang="ts">

    // ToolCallName component
    //
    // A headless inner part of ToolCall: the name of the tool in a tool call, shown in the summary. Contract: a plain wrapper with the base class and children.
    // Draws nothing and carries no strings of its own; the consumer supplies the text.

</script>

<template>
    <!-- ToolCallName.vue -->
    <span
        class="tool-call-name"

    >
        <slot />
    </span>
</template>
