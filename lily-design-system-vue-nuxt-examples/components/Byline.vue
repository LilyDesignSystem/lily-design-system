<script setup lang="ts">

    // Byline component
    //
    // Author attribution with optional publish and update timestamps.
    // Renders a <div> containing the authors (default slot) plus two
    // optional named slots — `published` and `updated` — that the consumer
    // fills with <time> elements.
    //
    // Slots:
    //   default   — author names/links.
    //   published — publish date/time, typically <time datetime="...">.
    //   updated   — last updated date/time, typically <time datetime="...">.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Use rel="author" on author links so RDFa/microformats consumers
    //     can extract the author

    import { useSlots } from "vue";
    const slots = useSlots();

</script>

<template>
    <!-- Byline.vue -->
    <div class="byline">
        <span class="byline-authors">
            <slot />
        </span>
        <span v-if="slots.published" class="byline-published">
            <slot name="published" />
        </span>
        <span v-if="slots.updated" class="byline-updated">
            <slot name="updated" />
        </span>
    </div>
</template>
