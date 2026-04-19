<script setup lang="ts">

    // Tooltip component
    //
    // A headless tooltip that displays brief, contextual information when made
    // visible. Uses role="tooltip" for semantic identification and is designed
    // to be linked to a trigger element via aria-describedby, providing
    // supplementary text that screen readers can announce. Tooltips are used to
    // clarify the function or meaning of elements without cluttering the interface.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The tooltip text content.
    //   visible — boolean, default false. Bindable boolean controlling visibility.
    //   id — string, default undefined. Optional id for aria-describedby linking to trigger element.
    //   ...restProps — additional HTML attributes spread onto the tooltip <div>.
    //
    // Syntax:
    //   <Tooltip id="tip" label="Additional info" v-model:visible={showTip} />
    //
    // Examples:
    //   <!-- Tooltip linked to a trigger button -->
    //   <button aria-describedby="tip"
    //     onmouseenter={() => showTip = true}
    //     onmouseleave={() => showTip = false}>Hover me</button>
    //   <Tooltip id="tip" label="Additional info" v-model:visible={showTip} />
    //
    // Keyboard:
    //   - Escape: consumer should hide the tooltip (not built into the component)
    //   - Tooltip itself does not receive focus; it describes another element
    //
    // Accessibility:
    //   - role="tooltip" identifies the element as a tooltip popup
    //   - id enables aria-describedby linking to the trigger element
    //   - Conditionally rendered: fully removed from DOM when not visible
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Uses {#if visible} for conditional rendering
    //   - Consumer manages visibility (hover, focus, etc.)
    //
    // References:
    //   - WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
    //   - MDN aria-describedby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby

    withDefaults(defineProps<{
        /** Tooltip text content. */
        label: string;
        /** Optional id for aria-describedby linking. */
        id?: string;
    }>(), {
        id: undefined,
    });

    const visible = defineModel<boolean>("visible", { default: false });

</script>

<template>
    <!-- Tooltip.vue -->
        <div v-if="visible"
            class="tooltip"
            role="tooltip"
            :id="id"
        >
            {{ label }}
        </div>
</template>
