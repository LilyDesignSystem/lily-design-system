<script setup lang="ts">

    // EndNotes component
    //
    // EndNotes for the Reuters-graphics-style article layout family.
    // Renders a <section> that consumers style.

    withDefaults(defineProps<{
        /** Accessible label set on aria-label. Defaults to 'End notes'. */
        label?: string;
    }>(), {
        
label: "End notes",
    });

</script>

<template>
    <!-- EndNotes.vue -->
    <section
        class="end-notes"
        :aria-label="label"
    >
        <slot />
    </section>
</template>
