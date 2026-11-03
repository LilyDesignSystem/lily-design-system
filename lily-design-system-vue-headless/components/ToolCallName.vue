<script setup lang="ts">
// ToolCallName component
//
// The name of the tool in a ToolCall, shown in its summary. Renders a <span> with the `tool-call-name`
// hook.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   default slot — optional. The tool name.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <span>.
//
// Syntax:
//   <ToolCallName>…</ToolCallName>
//
// Examples:
//   <ToolCall status="running"><ToolCallName>search_web</ToolCallName></ToolCall>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role or ARIA: plain text inside the ToolCall summary
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ToolCall; draws nothing and carries no strings of its own
//
// References:
//   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span

</script>

<template>
    <!-- ToolCallName.vue -->
    <span class="tool-call-name">
        <slot />
    </span>
</template>
