<script setup lang="ts">
// ToolBar component
//
// A headless toolbar container that provides the ARIA toolbar role and built-in
// keyboard navigation for action buttons and controls, through the shared
// attachToolbar (widget-keys): one tab stop that follows focus, arrows that
// move between enabled controls and wrap, Home and End.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the toolbar via aria-label.
//   default slot. ToolBarButton elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ToolBar label="Editor tools">...</ToolBar>
//
// Examples:
//   <!-- Text editor toolbar -->
//   <ToolBar label="Editor tools">
//     <ToolBarButton>Bold</ToolBarButton>
//     <ToolBarButton>Italic</ToolBarButton>
//     <ToolBarButton>Underline</ToolBarButton>
//   </ToolBar>
//
// Keyboard:
//   - ArrowRight: move focus to next enabled item (wraps to first); ArrowLeft in right-to-left
//   - ArrowLeft: move focus to previous enabled item (wraps to last); ArrowRight in right-to-left
//   - ArrowDown / ArrowUp instead, with aria-orientation="vertical"
//   - A text field, select or textarea in the toolbar keeps its own arrows
//   - Home: move focus to first item
//   - End: move focus to last item
//   - Tab: enter/exit the toolbar
//
// Accessibility:
//   - role="toolbar" identifies the container as a toolbar widget
//   - aria-label provides the accessible name for the toolbar
//
// Internationalization:
//   - The label prop accepts any translated string
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Compound component: use with ToolBarButton
//   - Keys come from attachToolbar in widget-keys; the toolbar contract holds every port to it
//   - Arrow keys wrap around at boundaries
//
// References:
//   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

import { onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import { attachToolbar } from "./widget-keys";
import { warnMissingName } from "./dev-warning";

const props = defineProps<{
    /** Accessible label. */
    label: string;
}>();

warnMissingName("ToolBar", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const toolbarRef = ref<HTMLElement | undefined>(undefined);

// The shared toolbar keys: one tab stop, arrows that skip a disabled control and swap in right-to-left, Home, End.
let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachToolbar(toolbarRef.value!);
});
onBeforeUnmount(() => detach?.());
</script>

<template>
    <!-- ToolBar.vue -->
    <div
        class="tool-bar"
        role="toolbar"
        :aria-label="label"
        ref="toolbarRef"
    >
        <slot />
    </div>
</template>
