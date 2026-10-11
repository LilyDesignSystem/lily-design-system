<script setup lang="ts">

    // StreamingText component
    //
    // A polite live region for text that grows over time. While `streaming` is true the region is marked busy (`aria-busy="true"`, `data-streaming="true"`) so assistive technology waits instead of announcing every chunk; when it flips to false the finished text is announced once (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`). The component never splits, times, reveals or animates the text: the consumer appends chunks to the children, and owns any caret or reduced-motion CSS.
    //
    // Props:
    //   label — string, optional. Accessible name of the status region.
    //   streaming — boolean, default false. True while chunks are still arriving.
    //   default slot — the text so far.
    //   ...restProps (attrs) — spread onto the root <div>.
    //
    // Keyboard: none.

    defineProps<{
        /** Accessible name of the region. */
        label?: string;
        /** Whether text is still arriving. */
        streaming?: boolean;
    }>();

</script>

<template>
    <!-- StreamingText.vue -->
    <div
        class="streaming-text"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        :aria-label="label"
        :aria-busy="streaming ? 'true' : undefined"
        :data-streaming="streaming ? 'true' : undefined"
    >
        <slot />
    </div>
</template>
