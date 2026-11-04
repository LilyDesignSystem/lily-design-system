<script setup lang="ts">
// TaskBar component
//
// A headless task bar container using the ARIA toolbar role. It renders a <div>
// with role="toolbar" and manages horizontal focus movement between action
// buttons via ArrowLeft/ArrowRight keys. Commonly used for quick access to
// frequently performed actions such as "New", "Open", "Save", or task-specific
// operations.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the toolbar via aria-label.
//   default slot. TaskBarButton elements.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <TaskBar label="Tasks">
//     <TaskBarButton>New</TaskBarButton>
//   </TaskBar>
//
// Examples:
//   <!-- Task bar with action buttons -->
//   <TaskBar label="Tasks">
//     <TaskBarButton>New</TaskBarButton>
//     <TaskBarButton>Open</TaskBarButton>
//     <TaskBarButton>Save</TaskBarButton>
//   </TaskBar>
//
// Keyboard:
//   - ArrowRight: move focus to next item, wrapping from last to first
//   - ArrowLeft: move focus to previous item, wrapping from first to last
//   - Home: move focus to the first item
//   - End: move focus to the last item
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
//   - Compound component: use with TaskBarButton
//   - Uses horizontal (ArrowLeft/ArrowRight) navigation
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

warnMissingName("TaskBar", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const barRef = ref<HTMLElement | undefined>(undefined);

let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachToolbar(barRef.value!);
});
onBeforeUnmount(() => detach?.());
</script>

<template>
    <!-- TaskBar.vue -->
    <div
        class="task-bar"
        role="toolbar"
        :aria-label="label"
        ref="barRef"
    >
        <slot />
    </div>
</template>
