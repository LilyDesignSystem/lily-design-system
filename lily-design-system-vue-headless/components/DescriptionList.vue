<script setup lang="ts">
// DescriptionList component
//
// A list of terms and their descriptions. Renders a <dl> with the `description-list` hook; items are
// DescriptionListItem.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accepted for API symmetry but not rendered by this component.
//   default slot — required. The DescriptionListItem children.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <dl>.
//
// Syntax:
//   <DescriptionList>…</DescriptionList>
//
// Examples:
//   <DescriptionList><DescriptionListItem><dt>Term</dt><dd>Description</dd></DescriptionListItem></DescriptionList>
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
    <!-- DescriptionList.vue -->
    <dl
        class="description-list"
        :aria-label="label"
    >
        <slot />
    </dl>
</template>
