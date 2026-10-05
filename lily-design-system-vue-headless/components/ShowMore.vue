<script setup lang="ts">

    // ShowMore component
    //
    // Long content behind a "show more / show less" toggle. The clamp is
    // consumer CSS keyed on data-expanded on .show-more-content (no inline
    // style); the content always stays in the accessibility tree.
    //
    // Props:
    //   moreLabel -- string, required. Button text while collapsed.
    //   lessLabel -- string, required. Button text while expanded.
    //   expanded -- boolean, default false. Bindable via v-model:expanded.
    //   default slot -- the content.
    //   ...attrs -- fall through onto the root <div>.
    //
    // Keyboard: native <button> (Enter / Space).
    // Accessibility: aria-expanded + aria-controls on the button.

    import { useId } from "vue";

    defineProps<{
        /** Button text while collapsed. */
        moreLabel: string;
        /** Button text while expanded. */
        lessLabel: string;
    }>();

    const expanded = defineModel<boolean>("expanded", { default: false });

    const contentId = `show-more-${useId()}`;

</script>

<template>
    <!-- ShowMore.vue -->
    <div class="show-more">
        <div
            class="show-more-content"
            :id="contentId"
            :data-expanded="expanded"
        >
            <slot />
        </div>
        <button
            type="button"
            class="show-more-button"
            :aria-expanded="expanded"
            :aria-controls="contentId"
            @click="expanded = !expanded"
        >
            {{ expanded ? lessLabel : moreLabel }}
        </button>
    </div>
</template>
