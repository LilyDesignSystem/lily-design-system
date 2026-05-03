<script setup lang="ts">

    // AiLabel component
    //
    // A headless inline indicator that communicates the presence of AI-generated
    // content and provides a pathway to AI explainability. Renders a <span> element
    // with visible text and accessible labelling. Used wherever AI is generating,
    // modifying, or enhancing content to reinforce AI transparency, accountability,
    // and explainability.
    //
    // Props:
    //   label — string, default "AI". Accessible name via aria-label.
    //   text — string, default "AI". Visible text displayed inside the indicator.
    //
    // Syntax:
    //   <AiLabel />
    //   <AiLabel text="AI generated" label="AI generated content" />
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Renders a bare <span> — no wrapper elements
    //
    // References:
    //   - Carbon Design System AI Label: https://carbondesignsystem.com/components/ai-label/usage/

    withDefaults(defineProps<{
        /** Accessible name for the indicator. */
        label?: string;
        /** Visible text displayed. */
        text?: string;
    }>(), {
        label: "AI",
        text: "AI",
    });

</script>

<template>
    <!-- AiLabel.vue -->
    <span
        class="ai-label"
        :aria-label="label"
    >{{ text }}</span>
</template>
