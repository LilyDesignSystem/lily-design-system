<script setup lang="ts">
// Container component
//
// A generic block-level content container. Renders a <div> with the `container` hook and no ARIA; use
// ContainerWithFixedWidth or ContainerWithFluidWidth when a width behaviour is wanted.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   default slot — optional. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <Container>…</Container>
//
// Examples:
//   <Container><p>Content</p></Container>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - No role or ARIA: a generic wrapper
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

// no props
</script>

<template>
    <!-- Container.vue -->
    <div class="container">
        <slot />
    </div>
</template>
