<script setup lang="ts">

    // InputGroup component
    //
    // A headless wrapper that places optional prefix and suffix addons around an
    // input. Renders <div role="group"> so assistive technology treats the
    // wrapped input plus addons as a single labelled unit. The prefix and suffix
    // come through named slots; the input itself is the consumer's child via the
    // default slot.
    //
    // Props:
    //   label  — string, optional. aria-label for the group.
    //   prefix — named slot, optional. Content before the input.
    //   suffix — named slot, optional. Content after the input.
    //   default slot — the input element.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <InputGroup label="Amount">
    //     <template #prefix>$</template>
    //     <input />
    //     <template #suffix>USD</template>
    //   </InputGroup>
    //
    // Examples:
    //   <!-- Currency input with prefix -->
    //   <InputGroup label="Price">
    //     <template #prefix>$</template>
    //     <input type="number" />
    //   </InputGroup>
    //
    //   <!-- Search with suffix button -->
    //   <InputGroup label="Search">
    //     <input type="search" />
    //     <template #suffix><button>Go</button></template>
    //   </InputGroup>
    //
    // Keyboard: None at the container level; the contained input handles
    // keyboard interaction natively.
    //
    // Accessibility:
    //   - role="group" with aria-label clusters the prefix, input, and suffix
    //   - prefix and suffix render inside <span> elements with named CSS classes
    //
    // Internationalization:
    //   - label is consumer-supplied; prefix/suffix content is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no CSS or styles
    //   - Prefix and suffix slots are conditionally rendered only when provided
    //
    // References:
    //   - WAI-ARIA role="group": https://www.w3.org/TR/wai-aria-1.2/#group

    import { useSlots } from "vue";

    withDefaults(defineProps<{
        /** aria-label for the group. */
        label?: string;
    }>(), {
        label: undefined,
    });

    const slots = useSlots();

</script>

<template>
    <!-- InputGroup.vue -->
    <div
        class="input-group"
        role="group"
        :aria-label="label"
    >
        <span v-if="slots.prefix" class="input-group-prefix">
            <slot name="prefix" />
        </span>
        <slot />
        <span v-if="slots.suffix" class="input-group-suffix">
            <slot name="suffix" />
        </span>
    </div>
</template>
