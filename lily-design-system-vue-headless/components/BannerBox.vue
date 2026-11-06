<script setup lang="ts">
// BannerBox component
//
// A headless layout component designed to be placed inside a Banner component.
// Renders a <div> that the consumer styles with flexbox horizontal layout
// (display: flex; flex-direction: row) to arrange banner content items side by
// side, such as a message and action buttons.
//
// Props:
//   label — string, optional. Accessible name via aria-label.
//
// Syntax:
//   <BannerBox>content</BannerBox>
//
// Examples:
//   <Banner>
//     <BannerBox>
//       <span>Important announcement</span>
//       <button>Learn more</button>
//     </BannerBox>
//   </Banner>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - No additional ARIA required; parent Banner provides landmark and aria-live
//   - Optional aria-label via label prop
//
// Internationalization:
//   - All text comes through default slot; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer applies display: flex; flex-direction: row; to .banner-box
//
// References:
//   - CSS Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout

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
    <!-- BannerBox.vue -->
    <div
        class="banner-box"
        :role="label ? 'group' : undefined"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
