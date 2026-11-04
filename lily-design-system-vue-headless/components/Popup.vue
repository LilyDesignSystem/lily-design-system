<script setup lang="ts">
// Popup component
//
// A headless overlay dialog that temporarily appears over the main
// content to convey information, prompt user actions, or display additional
// options. It renders a <div role="dialog" popover="auto">: the native Popover API
// puts it in the top layer while open and closes it on Escape and on a click outside
// it (light dismiss), with no script; v-model:open follows the toggle event. Similar to Popover but designed as a general-purpose overlay dialog.
// Commonly used for confirmations, prompts, contextual actions, and inline forms.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the popup dialog via aria-label.
//   open — boolean, default false, bindable (v-model:open). Whether the popup is
//     visible; set to false when the browser closes it (Escape, light dismiss, a trigger).
//   id — string, optional (fallthrough attribute). Give one so a trigger can name the
//     popup with commandfor.
//   default slot. Content rendered inside the dialog.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Popup label="Info" v-model:open>{children}</Popup>
//
// Examples:
//   <button type="button" command="toggle-popover" commandfor="info">Toggle info</button>
//   <Popup id="info" label="Additional information" v-model:open="showInfo">
//     <p>Here is some contextual information.</p>
//   </Popup>
//
// Keyboard:
//   - Escape: the browser closes the popup (Popover API); where the API is missing
//     the consumer closes it by setting open to false
//   - Tab: not trapped; a popover is non-modal
//
// Accessibility:
//   - role="dialog" identifies the popup as a dialog overlay
//   - aria-label provides the accessible name for the dialog
//   - Always in the DOM so a trigger can name its id; closed it is not displayed
//     (the popover UA style, or `hidden` where the Popover API is missing)
//
// Internationalization:
//   - The label prop is the only text; all content comes through children
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer provides the trigger (command="toggle-popover" commandfor={id})
//   - Native first: popover="auto"; where showPopover is missing, `hidden` instead
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
//   - WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog

import { onMounted, ref, watch, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";

const props = defineProps<{
    /** Accessible label for the dialog. */
    label: string;
}>();

warnMissingName("Popup", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const open = defineModel<boolean>("open", { default: false });
const el = ref<HTMLElement | null>(null);

// Open or close through the Popover API; where it is missing (jsdom, engines before Chrome 114, Firefox 125,
// Safari 17) use `hidden`, and drop `popover`, which jsdom's UA stylesheet would otherwise keep hidden.
function sync(value: boolean): void {
    const node = el.value;
    if (!node) return;
    if (typeof node.showPopover !== "function" || typeof node.hidePopover !== "function") {
        node.removeAttribute("popover");
        node.toggleAttribute("hidden", !value);
        return;
    }
    try {
        if (value) node.showPopover();
        else node.hidePopover();
    } catch {
        // Already in that state (older engines throw): nothing to do.
    }
}

onMounted(() => sync(open.value));
watch(open, sync);

// The browser's own changes (Escape, light dismiss, a commandfor trigger) write back to v-model:open.
function onToggle(event: Event): void {
    open.value = (event as ToggleEvent).newState === "open";
}
</script>

<template>
    <!-- Popup.vue -->
    <div
        ref="el"
        class="popup"
        role="dialog"
        :aria-label="label"
        popover="auto"
        @toggle="onToggle"
    >
        <slot />
    </div>
</template>
