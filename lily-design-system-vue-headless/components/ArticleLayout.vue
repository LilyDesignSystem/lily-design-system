<script setup lang="ts">

    // ArticleLayout component
    //
    // ArticleLayout for the Reuters-graphics-style article layout family.
    // Renders a <article> that consumers style.

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        
label: undefined,
    });

</script>

<template>
    <!-- ArticleLayout.vue -->
    <article
        class="article-layout"
        :aria-label="label"
    >
        <slot />
    </article>
</template>
