<script setup lang="ts">
// BodyText component
//
// A plain container that marks a run of body text (paragraphs, lists) so the consumer's CSS can target
// it with one selector. It applies no typography itself; intended to sit inside ContentBlock, which
// constrains the width.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   default slot — required. The text content (p, ul, ol, ...).
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <BodyText>…</BodyText>
//
// Examples:
//   <BodyText><p>First paragraph.</p><p>Second paragraph.</p></BodyText>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role or ARIA of its own: the meaning comes from the child elements (p, ul, ol)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Class hook only (`body-text`); typography is the consumer's CSS
//
// References:
//   - Reuters Graphics BodyText (the inspiration): https://github.com/reuters-graphics/graphics-components

</script>

<template>
    <!-- BodyText.vue -->
    <div class="body-text">
        <slot />
    </div>
</template>
