<script setup lang="ts">

    // IconListItem component
    //
    // One item in an IconList with a leading icon slot. The icon is rendered
    // inside a span with aria-hidden="true" so it is treated as decorative;
    // the text in the default slot carries the accessible content.
    //
    // Props:
    //   default slot — text content.
    //   icon slot   — leading icon content (svg, emoji, glyph). Decorative.
    //
    // Syntax:
    //   <IconListItem>
    //     <template #icon>★</template>
    //     Featured article
    //   </IconListItem>
    //
    // Accessibility:
    //   - The icon span carries aria-hidden="true"
    //   - The text content is the accessible content of the item
    //
    // Internationalization:
    //   - The default slot accepts any text; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Named slot `icon` is rendered only when content is supplied
    //
    // References:
    //   - USWDS Icon list: https://designsystem.digital.gov/components/icon-list/

    import { useSlots } from "vue";

    const slots = useSlots();

</script>

<template>
    <!-- IconListItem.vue -->
    <li class="icon-list-item">
        <span
            v-if="slots.icon"
            class="icon-list-item-icon"
            aria-hidden="true"
        >
            <slot name="icon" />
        </span>
        <span class="icon-list-item-text">
            <slot />
        </span>
    </li>
</template>
