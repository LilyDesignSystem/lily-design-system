<script setup lang="ts">
// SlideOutDrawer component
//
// A headless slide-out drawer that renders a modal <dialog> (opened with showModal()) which
// slides in from the side of the screen. When open, it can be dismissed with
// the Escape key. Commonly used for navigation menus, filters, settings panels,
// or secondary content in mobile and web applications.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the dialog via aria-label.
//   open — boolean, default false. Whether the drawer is visible; bindable via v-model:open.
//   default slot. The drawer content.
//   ...restProps — additional HTML attributes spread onto the <dialog>.
//
// Syntax:
//   <SlideOutDrawer label="Menu" v-model:open={isOpen}>
//     <nav>Menu content</nav>
//   </SlideOutDrawer>
//
// Examples:
//   <!-- Navigation drawer with close button -->
//   <SlideOutDrawer label="Navigation menu" v-model:open={isOpen}>
//     <nav>
//       <ul><li><a href="/">Home</a></li></ul>
//     </nav>
//     <button onclick={() => isOpen = false}>Close</button>
//   </SlideOutDrawer>
//
//   <!-- Settings panel -->
//   <SlideOutDrawer label="Settings panel" v-model:open={settingsOpen}>
//     <h2>Settings</h2>
//     <form><label><input type="checkbox" /> Enable notifications</label></form>
//   </SlideOutDrawer>
//
// Keyboard:
//   - Escape: closes the drawer (keydown or the native cancel event)
//   - Tab: stays inside while open (showModal())
//
// Accessibility:
//   - role="dialog" provided natively by the <dialog> element
//   - aria-label describes the drawer purpose
//   - aria-modal="true" is true: showModal() makes the page behind inert and traps Tab
//   - focus moves inside on open and returns to the opener on close
//   - tabindex="-1" allows the dialog to receive programmatic focus
//   - WCAG 2.2 AAA: properly labeled modal with keyboard dismissal
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Open uses defineModel() for two-way binding with v-model:open
//   - Completely removed from DOM when closed ({#if open})
//   - Focus trapping comes from showModal() (open-attribute fallback where it is missing, e.g. jsdom);
//     consumer implements slide animations via CSS
//
// References:
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

import { nextTick, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";

const props = defineProps<{
    /** Accessible label for the dialog */
    label: string;
}>();

warnMissingName(
    "SlideOutDrawer",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const open = defineModel<boolean>("open", { default: false });

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        open.value = false;
    }
}

// A real modal: showModal() puts the <dialog> in the top layer, makes the page behind it inert and traps Tab. Where
// showModal is missing (jsdom) fall back to the open attribute. Focus moves inside on open and returns to the element
// that had it when the panel opened, once it closes. A function ref, so this runs as the element mounts and unmounts.
let current: HTMLDialogElement | null = null;
let opener: HTMLElement | null = null;
function setDialog(el: unknown) {
    const node = el instanceof HTMLDialogElement ? el : null;
    if (node === current) return;
    if (current) {
        const old = current;
        if (old.open) {
            if (typeof old.close === "function") old.close();
            else old.removeAttribute("open");
        }
        if (opener && opener !== document.body && opener.isConnected) opener.focus();
        opener = null;
    }
    current = node;
    if (!node) return;
    opener = document.activeElement as HTMLElement | null;
    // showModal() throws on a dialog that is not in the document yet (its parent is still being mounted): wait a tick.
    if (node.isConnected) show(node);
    else void nextTick(() => current === node && show(node));
}
function show(node: HTMLDialogElement) {
    if (!node.open) {
        if (typeof node.showModal === "function") node.showModal();
        else node.setAttribute("open", "");
    }
    if (!node.contains(document.activeElement)) node.focus();
}

function oncancel(event: Event) {
    event.preventDefault();
    open.value = false;
}
function onclose() {
    open.value = false;
}
</script>

<template>
    <!-- SlideOutDrawer: a modal <dialog>, conditionally rendered and opened with showModal() -->
    <dialog
        v-if="open"
        :ref="setDialog"
        class="slide-out-drawer"
        :aria-label="label"
        aria-modal="true"
        tabindex="-1"
        @keydown="handleKeydown"
        @cancel="oncancel"
        @close="onclose"
    >
        <slot />
    </dialog>
</template>
