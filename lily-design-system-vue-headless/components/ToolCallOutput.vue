<script setup lang="ts">
// ToolCallOutput component
//
// The output or result returned by a tool in a ToolCall. Renders a <div> with the `tool-call-output`
// hook; with a `label` it becomes a named group, without one it has no role.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name; when given, role="group" and aria-label are rendered, otherwise neither.
//   default slot — optional. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <ToolCallOutput label="…">…</ToolCallOutput>
//
// Examples:
//   <ToolCall status="done" open><ToolCallOutput label="…"><pre>…</pre></ToolCallOutput></ToolCall>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - role="group" and aria-label appear only when `label` is given
//   - Large output can be scrolled; make a scrollable region keyboard-focusable through attrs
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ToolCall; draws nothing and carries no strings of its own
//
// References:
//   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

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
