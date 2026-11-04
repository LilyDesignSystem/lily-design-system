<script setup lang="ts">
// MenuBar component
//
// A headless horizontal menu bar using the ARIA menubar role, typically found
// at the top of an application window. It renders a <div> with role="menubar"
// and manages horizontal focus movement between top-level menu items via
// ArrowLeft/ArrowRight keys, mimicking desktop application menu bars (e.g.,
// File, Edit, View). Each top-level item may open a submenu or trigger an action.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name applied via aria-label.
//   default slot. MenuBarButton elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <MenuBar label="Main menu">
//     <MenuBarButton>File</MenuBarButton>
//   </MenuBar>
//
// Examples:
//   <!-- Basic application menu bar -->
//   <MenuBar label="Main menu">
//     <MenuBarButton>File</MenuBarButton>
//     <MenuBarButton>Edit</MenuBarButton>
//     <MenuBarButton>View</MenuBarButton>
//   </MenuBar>
//
// Keyboard:
//   - ArrowRight: move focus to next menu bar item, wrapping from last to first
//   - ArrowLeft: move focus to previous menu bar item, wrapping from first to last
//   - Home: move focus to the first menu bar item
//   - End: move focus to the last menu bar item
//
// Accessibility:
//   - role="menubar" identifies the container as a horizontal menu bar widget
//   - aria-label provides an accessible name describing the menu bar purpose
//   - Child MenuBarButton elements provide role="menuitem" with tabindex="-1"
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All menu bar item content comes through the default slot
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: pair with MenuBarButton for individual entries
//   - Uses horizontal (ArrowLeft/ArrowRight) navigation, not vertical
//   - Arrow keys wrap around at boundaries
//
// References:
//   - WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

import { onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import { attachMenu } from "./menu-keys";
import { warnMissingName } from "./dev-warning";

const props = defineProps<{
    /** Accessible label. */
    label: string;
}>();

warnMissingName("MenuBar", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const barRef = ref<HTMLElement | undefined>(undefined);

let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachMenu(barRef.value!, "horizontal");
});
onBeforeUnmount(() => detach?.());
</script>

<template>
    <!-- MenuBar.vue -->
    <div
        class="menu-bar"
        role="menubar"
        :aria-label="label"
        ref="barRef"
    >
        <slot />
    </div>
</template>
