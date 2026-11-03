<script setup lang="ts">
// DescriptionListItem component
//
// One term-and-description group inside a DescriptionList. A <div> is the only element HTML allows to
// wrap dt/dd pairs in a <dl>.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
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
//   - aria-label comes from `label` when given (the Svelte port accepts but does not render it)
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders no aria-label; this Vue component does not (the Svelte one is canonical)
//
// References:
//   - MDN <dl>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

withDefaults(
    defineProps<{
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- DescriptionListItem.vue -->
    <div
        class="description-list-item"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
