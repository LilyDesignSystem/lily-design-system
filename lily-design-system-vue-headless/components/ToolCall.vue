<script setup lang="ts">

    // ToolCall component
    //
    // A headless disclosure for one tool invocation, built on the native <details>. Closed by default. The `summary` content (typically ToolCallName and ToolCallStatus) goes inside <summary class="tool-call-summary">; the body (ToolCallInput, ToolCallOutput, ToolCallError) goes inside <div class="tool-call-content">. `status` (pending | running | done | error) sets data-status on the root, and aria-busy="true" only while running. The component never animates, times or opens itself: the consumer owns `open` (open it on error so ToolCallError is not hidden) and any spinner/animation CSS.
    //
    // Props: status (string, optional), open (v-model, default false).
    // Slots: summary (name + status words), default (the body).
    // Keyboard: Enter / Space on the native <summary> toggles.

    defineProps<{
        /** pending | running | done | error. */
        status?: string;
    }>();

    const open = defineModel<boolean>("open", { default: false });

    function ontoggle(event: Event) {
        open.value = (event.target as HTMLDetailsElement).open;
    }

</script>

<template>
    <!-- ToolCall.vue -->
    <details
        class="tool-call"
        :open="open"
        :data-status="status"
        :aria-busy="status === 'running' ? 'true' : undefined"
        @toggle="ontoggle"
    >
        <summary class="tool-call-summary">
            <slot name="summary" />
        </summary>
        <div class="tool-call-content">
            <slot />
        </div>
    </details>
</template>
