<script setup lang="ts">

    // ContentBlock component
    //
    // ContentBlock for the Reuters-graphics-style article layout family.
    // Renders a <div> that consumers style.

    withDefaults(defineProps<{
        /** Content width preset. */
        width?: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid";
    }>(), {
        
width: "normal",
    });

</script>

<template>
    <!-- ContentBlock.vue -->
    <div
        class="content-block"
        :data-width="width"
    >
        <slot />
    </div>
</template>
