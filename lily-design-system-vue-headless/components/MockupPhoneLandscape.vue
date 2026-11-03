<script setup lang="ts">
// MockupPhoneLandscape component
//
// A device frame that looks like a mobile phone in landscape orientation. Renders a <div role="img">
// with the `mockup-phone-landscape` hook, named by a required label.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, required. The text alternative, rendered as aria-label.
//   default slot — optional. The framed content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <MockupPhoneLandscape label="…">…</MockupPhoneLandscape>
//
// Examples:
//   <MockupPhoneLandscape label="The dashboard on a phone"><img src="screen.png" alt="" /></MockupPhoneLandscape>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - role="img" makes the whole frame one image whose name is `label`; its descendants are presentational, so interactive content inside is not reachable by assistive technology
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Use for pictures of a device, not for live interactive content
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

defineProps<{
    label: string;
}>();
</script>

<template>
    <!-- MockupPhoneLandscape.vue -->
    <div
        class="mockup-phone-landscape"
        role="img"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
