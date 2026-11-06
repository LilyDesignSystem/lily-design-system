<script setup lang="ts">
// DescriptionListItem component
//
// One term-and-description group inside a DescriptionList. A <div> is the only element HTML allows to
// wrap dt/dd pairs in a <dl>.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   default slot — required. The <dt> and <dd> elements.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <DescriptionListItem>…</DescriptionListItem>
//
// Examples:
//   <DescriptionListItem><dt>Name</dt><dd>Sam</dd></DescriptionListItem>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

withDefaults(defineProps<{}>(), {});
</script>

<template>
    <!-- DescriptionListItem.vue -->
    <div class="description-list-item">
        <slot />
    </div>
</template>
