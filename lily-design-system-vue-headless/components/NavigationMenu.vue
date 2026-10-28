<script setup lang="ts">
// NavigationMenu component
//
// A headless navigation menu that provides a semantic <nav> landmark with an
// accessible label for site-wide or section-level navigation. It enables screen
// reader users to quickly locate and jump to the navigation area using landmark
// navigation. Suitable for primary navigation bars, sidebar navigation, footer
// navigation, and any grouped set of navigation links.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label to distinguish this nav landmark.
//   overflow — boolean, optional (default false). Overflow mode: renders the list (<ul class="navigation-menu-list">, so
//     your slot content must be <li> items) and a hidden "More" item; a ResizeObserver moves the items that do not fit
//     into a disclosure. Publishes data-overflow="true" on the root. Without JavaScript the links simply wrap. The set
//     of items must not change while mounted: give the component a new `key` when it does.
//   moreLabel — string, required when overflow is set. The More button's accessible name (no English from us).
//   default slot. Navigation content (links, lists, nested menus).
//   ...restProps — additional HTML attributes spread onto the <nav>.
//
// Syntax:
//   <NavigationMenu label="Main navigation">
//     <a href="/">Home</a>
//   </NavigationMenu>
//
// Examples:
//   <!-- Primary navigation -->
//   <NavigationMenu label="Main navigation">
//     <a href="/">Home</a>
//     <a href="/about">About</a>
//   </NavigationMenu>
//
//   <!-- Footer navigation with list structure -->
//   <NavigationMenu label="Footer navigation">
//     <ul>
//       <li><a href="/privacy">Privacy Policy</a></li>
//       <li><a href="/terms">Terms of Service</a></li>
//     </ul>
//   </NavigationMenu>
//
//   <NavigationMenu label="Main navigation" overflow more-label="More">
//     <li><a href="/">Home</a></li>
//     <li><a href="/about">About</a></li>
//   </NavigationMenu>
//
// Keyboard:
//   - None by default — a passive container; links use the browser's Tab and Enter.
//   - Overflow mode: Enter / Space toggle the More button; Escape closes the list and returns focus to the button;
//     Tab moves through the moved links in order; a click outside closes it. The opened list is in normal flow.
//
// Accessibility:
//   - <nav> element implicitly has role="navigation", making it a navigation landmark
//   - aria-label distinguishes this navigation from other <nav> landmarks on the page
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All navigation content comes through the default slot
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal state or keyboard handling; relies on native link behavior
//
// References:
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation
//   - WAI-ARIA Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/

import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { setupOverflowNavigation, type OverflowNavigation } from "./overflow-navigation";

const props = withDefaults(
    defineProps<{
        /** Accessible label. */
        label: string;
        /** Overflow mode: items that do not fit move into a "More" disclosure. Slot content must be <li> items. */
        overflow?: boolean;
        /** Accessible name of the More button. Required when `overflow` is set. */
        moreLabel?: string;
    }>(),
    { overflow: false, moreLabel: "" },
);

const root = ref<HTMLElement | null>(null);
let handle: OverflowNavigation | null = null;

function start() {
    handle?.dispose();
    handle = props.overflow && root.value ? setupOverflowNavigation(root.value) : null;
}

onMounted(start);
watch(() => props.overflow, start, { flush: "post" });
onBeforeUnmount(() => handle?.dispose());
</script>

<template>
    <!-- NavigationMenu.vue -->
    <nav
        ref="root"
        class="navigation-menu"
        :aria-label="label"
        :data-overflow="overflow ? 'true' : undefined"
    >
        <ul
            v-if="overflow"
            class="navigation-menu-list"
        >
            <slot />
            <li
                class="navigation-menu-more"
                hidden
            >
                <button
                    class="navigation-menu-more-button"
                    type="button"
                    aria-expanded="false"
                >
                    {{ moreLabel }}
                </button>
                <ul
                    class="navigation-menu-more-list"
                    hidden
                ></ul>
            </li>
        </ul>
        <slot v-else />
    </nav>
</template>
