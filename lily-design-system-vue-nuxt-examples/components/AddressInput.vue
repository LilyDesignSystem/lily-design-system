<script setup lang="ts">
// AddressInput component
//
// A group for the parts of a postal address (line 1, line 2, town, postcode, ...). Renders a <div>
// with the `address-input` hook; it adds no role, so pass role="group" through attrs.
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The content.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <AddressInput label="…">…</AddressInput>
//
// Examples:
//   <AddressInput label="Delivery address"><TextInput label="Line 1" /><TextInput label="Postcode" /></AddressInput>
//
// Keyboard:
//   - Tab moves between the inputs inside the group (native)
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - No role is rendered; pass role="group" through attrs so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders role="group"; this Vue component does not (the Svelte one is canonical)
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

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
    <!-- AddressInput.vue -->
    <div
        class="address-input"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
