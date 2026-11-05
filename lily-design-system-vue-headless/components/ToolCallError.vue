<script setup lang="ts">
// ToolCallError component
//
// The error shown when a tool call fails. Renders a <div role="alert"> with the `tool-call-error`
// hook, so the error is announced when it appears.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   default slot — optional. The error text.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <ToolCallError>…</ToolCallError>
//
// Examples:
//   <ToolCall status="error" open><ToolCallError>The tool timed out.</ToolCallError></ToolCall>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - role="alert" announces the error assertively when it is inserted
//   - Open the ToolCall on error so the alert is not inside a closed <details>, where it would not be announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - A part of ToolCall; carries no strings of its own
//
// References:
//   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
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
