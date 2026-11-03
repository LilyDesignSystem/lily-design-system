<script setup lang="ts">
// ToolCallStatus component
//
// The status of a tool call as a word (pending, running, done or error), shown in the ToolCall
// summary. Renders a <span> with the `tool-call-status` hook; `status` is exposed as data-status for
// the consumer's CSS.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   status — string, optional. Rendered as data-status, for example pending, running, done or error.
//   default slot — optional. The visible status word.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <span>.
//
// Syntax:
//   <ToolCallStatus status="running">…</ToolCallStatus>
//
// Examples:
//   <ToolCallStatus status="running">Running</ToolCallStatus>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - The visible word carries the meaning; never show the status by colour alone (WCAG 1.4.1)
//   - No role or live region of its own
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ToolCall; carries no strings of its own
//   - data-status is for the consumer's CSS, not an ARIA state
//
// References:
//   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

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
