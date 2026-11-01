<script setup lang="ts">
import { shallowRef, toRef } from "vue";
import { usePopoverState } from "./popover";
// HoverCard component
//
// A hover card that displays supplementary content when triggered, typically by a
// hover or focus interaction on a trigger element. It conditionally renders a container
// with role="tooltip" when the open prop is true. Useful for user profile previews,
// link previews, contextual help, or any popover-style content.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the hover card via aria-label.
//   open — boolean, default false. Whether the hover card is visible; bindable with v-model:open.
//   default slot. Content to display inside the hover card.
//   ...restProps — additional HTML attributes spread onto the container div.
//
// Syntax:
//   <HoverCard label="User info" v-model:open>{children}</HoverCard>
//
// Examples:
//   <!-- Hover card triggered by mouse/focus events on a button -->
//   <button
//     onmouseenter={() => open = true}
//     onmouseleave={() => open = false}
//     onfocus={() => open = true}
//     onblur={() => open = false}
//   >Hover me</button>
//   <HoverCard label="User info" v-model:open>
//     <p>Profile details here</p>
//   </HoverCard>
//
// Keyboard:
//   - None at the component level — consumer manages focus-based visibility on the trigger element
//
// Accessibility:
//   - role="tooltip" identifies the hover card as supplementary descriptive content
//   - aria-label provides an accessible name describing the hover card content
//   - Consumer should link the trigger to the tooltip via aria-describedby
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//   - All content comes through the default slot
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling and positioning
//   - Uses defineModel() for two-way binding on the open prop
//   - Consumer is responsible for managing hover/focus events on the trigger element
//   - Fully removed from DOM when closed via {#if open}
//
// References:
//   - WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
//   - WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

const props = defineProps<{
    label: string;
}>();

const open = defineModel<boolean>("open", { default: false });
const panelEl = shallowRef<HTMLElement | null>(null);
usePopoverState(panelEl, toRef(props, "open"));
</script>

<template>
    <!-- HoverCard.vue -->
    <div
        ref="panelEl"
        popover="manual"
        class="hover-card"
        role="tooltip"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
