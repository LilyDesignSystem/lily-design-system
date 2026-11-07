<script setup lang="ts">
// ContextualHelp component
//
// A help button that opens a popover with explanatory content. Renders a
// <div> wrapper containing a trigger button (aria-haspopup="dialog") and
// a panel with role="dialog" popover="auto" wired via aria-controls /
// aria-expanded. The trigger opens and closes the panel through the native
// Popover API with command="toggle-popover" commandfor (and popovertarget for
// engines before command/commandfor): open, Escape and light dismiss need no
// script, and the panel's toggle event keeps `expanded` in step. Where the
// Popover API is missing the click toggles `expanded` and the panel's `hidden`.
//
// Props:
//   label        — string, REQUIRED. aria-label for the trigger (its accessible name).
//   triggerLabel — string, REQUIRED. Visible text of the trigger, such as "?" or "؟".
//                  No default; pass "" when CSS draws an icon.
//   expanded     — boolean, default false, bindable (v-model:expanded). Whether the popover is open.
//   default slot — popover content.
//   emits click(event) — trigger click handler; event.preventDefault() stops the toggle.
//
// Syntax:
//   <ContextualHelp label="Help" trigger-label="?" v-model:expanded="open">
//     <p>Help text goes here.</p>
//   </ContextualHelp>
//
// Accessibility:
//   - trigger has aria-haspopup="dialog", aria-expanded, aria-controls
//   - panel has role="dialog" with id matching aria-controls and commandfor
//
// Internationalization:
//   - Accessible name (label) and visible glyph (triggerLabel) via props; panel content via slot
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label and triggerLabel are required

import { onMounted, ref, useId, watch } from "vue";

// useId is hydration-stable, so commandfor still names the panel after SSR.
const panelId = `contextual-help-panel-${useId()}`;

defineProps<{
    /** Accessible label for the trigger (REQUIRED). */
    label: string;
    /** Visible text of the trigger, such as "?" (REQUIRED; no default). */
    triggerLabel: string;
}>();

const expanded = defineModel<boolean>("expanded", { default: false });

const emit = defineEmits<{
    (e: "click", event: MouseEvent): void;
}>();

const panel = ref<HTMLElement | null>(null);

function supported(node: HTMLElement): boolean {
    return typeof node.showPopover === "function" && typeof node.hidePopover === "function";
}

// Open or close through the Popover API, or with `hidden` where it is missing (jsdom's UA stylesheet hides any
// [popover] it cannot open, so the fallback drops the attribute).
function sync(value: boolean): void {
    const node = panel.value;
    if (!node) return;
    if (!supported(node)) {
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

onMounted(() => sync(expanded.value));
watch(expanded, sync);

function onClick(event: MouseEvent): void {
    emit("click", event);
    if (event.defaultPrevented) return;
    // With the Popover API the browser toggles the panel and onToggle follows it.
    if (panel.value && !supported(panel.value)) expanded.value = !expanded.value;
}

function onToggle(event: Event): void {
    expanded.value = (event as ToggleEvent).newState === "open";
}
</script>

<template>
    <!-- ContextualHelp.vue -->
    <div class="contextual-help">
        <button
            class="contextual-help-trigger"
            type="button"
            :aria-label="label"
            aria-haspopup="dialog"
            :aria-expanded="expanded"
            :aria-controls="panelId"
            command="toggle-popover"
            :commandfor="panelId"
            :popovertarget="panelId"
            @click="onClick"
        >
            {{ triggerLabel }}
        </button>
        <div
            ref="panel"
            class="contextual-help-panel"
            :id="panelId"
            role="dialog"
            :aria-label="label"
            popover="auto"
            @toggle="onToggle"
        >
            <slot />
        </div>
    </div>
</template>
