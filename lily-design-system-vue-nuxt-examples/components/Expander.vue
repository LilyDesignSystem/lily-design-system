<script setup lang="ts">

    // Expander component
    //
    // An expander that shows or hides additional content with a toggle button.
    // Similar to native <details>/<summary> but uses a <button> trigger with
    // aria-expanded and aria-controls for full control over behavior. Useful for
    // FAQ sections, collapsible panels, settings groups, and progressive disclosure.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Button text and accessible name for both the button and content region.
    //   expanded — boolean, default false. Whether the content is visible; bindable.
    //   default slot. Expandable content rendered when expanded is true.
    //   ...restProps — additional HTML attributes spread onto the outer <div> wrapper.
    //
    // Syntax:
    //   <Expander label="Show details" v-model:expanded>Content</Expander>
    //
    // Examples:
    //   <!-- Basic expander -->
    //   <Expander label="Show details" v-model:expanded>
    //     <p>Details here...</p>
    //   </Expander>
    //
    //   <!-- Advanced settings panel -->
    //   <Expander label="Advanced settings" v-model:expanded>
    //     <form>...</form>
    //   </Expander>
    //
    // Keyboard:
    //   - Enter: toggles the expander open/closed (native button behavior)
    //   - Space: toggles the expander open/closed (native button behavior)
    //   - Tab: moves focus to/from the toggle button
    //
    // Accessibility:
    //   - aria-expanded on the button indicates whether content is visible
    //   - aria-controls references the ID of the expandable content region
    //   - role="region" on the content container identifies the expandable area
    //   - aria-label on the content region provides an accessible name
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Generates unique contentId via Math.random() for aria-controls/id link
    //   - Content removed from DOM when collapsed (not just hidden)
    //   - Uses defineModel() on expanded for two-way state binding
    //
    // References:
    //   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

    defineProps<{
        /** Button label / accessible name. */
        label: string;
    }>();

    const expanded = defineModel<boolean>("expanded", { default: false });

    const contentId = `expander-${Math.random().toString(36).slice(2, 9)}`;

</script>

<template>
    <div
        class="expander"
    >
        <button
            type="button"
            :aria-expanded="expanded"
            :aria-controls="contentId"
            @click="expanded = !expanded"
        >
            {{ label }}
        </button>
                <div v-if="expanded"
                :id="contentId"
                role="region"
                :aria-label="label"
            >
                <slot />
            </div>
    </div>
</template>
