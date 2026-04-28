<script setup lang="ts">

    // ContextualHelp component
    //
    // A help button that opens a popover with explanatory content. Renders a
    // <div> wrapper containing a trigger button (aria-haspopup="dialog") and
    // a panel with role="dialog" wired via aria-controls / aria-expanded.
    //
    // Props:
    //   label    — string, REQUIRED. aria-label for the trigger.
    //   expanded — boolean, default false. Whether the popover is open.
    //   default slot — popover content.
    //   emits click(event) — trigger click handler.
    //
    // Syntax:
    //   <ContextualHelp label="Help" :expanded="open"
    //                   @click="open = !open">
    //     <p>Help text goes here.</p>
    //   </ContextualHelp>
    //
    // Accessibility:
    //   - trigger has aria-haspopup="dialog", aria-expanded, aria-controls
    //   - panel has role="dialog" with id matching aria-controls
    //   - hidden attribute toggles panel visibility
    //
    // Internationalization:
    //   - Trigger label via prop; panel content via slot
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required

    const panelId = `contextual-help-panel-${Math.random().toString(36).slice(2, 9)}`;

    withDefaults(defineProps<{
        /** Accessible label for the trigger (REQUIRED). */
        label: string;
        /** Whether the popover is open. */
        expanded?: boolean;
    }>(), {
        expanded: false,
    });

    defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

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
            @click="$emit('click', $event)"
        >?</button>
        <div
            class="contextual-help-panel"
            :id="panelId"
            role="dialog"
            :hidden="!expanded"
        >
            <slot />
        </div>
    </div>
</template>
