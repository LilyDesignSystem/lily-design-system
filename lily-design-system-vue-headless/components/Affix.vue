<script setup lang="ts">

    // Affix component
    //
    // A wrapper that pins its content to a viewport position while the page
    // scrolls. Uses CSS `position: sticky` as the headless behavior, exposing
    // `offsetTop` and/or `offsetBottom` as inline style values along with
    // `data-offset-top` / `data-offset-bottom` attributes for consumer CSS hooks.
    //
    // Props:
    //   offsetTop    — number (px), optional. Distance from top edge when affixed.
    //   offsetBottom — number (px), optional. Distance from bottom edge when affixed.
    //   default slot — content to be affixed.
    //
    // Syntax:
    //   <Affix :offset-top="0">…</Affix>
    //
    // Examples:
    //   <Affix :offset-top="0">
    //     <header>Sticky header</header>
    //   </Affix>
    //
    //   <Affix :offset-bottom="16">
    //     <button>Floating action</button>
    //   </Affix>
    //
    // Accessibility:
    //   - Purely structural; no ARIA roles or attributes added.
    //
    // Internationalization:
    //   - No user-facing strings; consumers provide all content.
    //
    // Claude rules:
    //   - Headless: only inline `position: sticky` + offset; no other styling.
    //   - When neither offsetTop nor offsetBottom is provided, defaults to top: 0.
    //
    // References:
    //   - MDN position: sticky — https://developer.mozilla.org/docs/Web/CSS/position#sticky_positioning
    //   - Ant Design Affix — https://ant.design/components/affix

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** Distance from top edge when affixed (px). */
        offsetTop?: number;
        /** Distance from bottom edge when affixed (px). */
        offsetBottom?: number;
    }>(), {
        offsetTop: undefined,
        offsetBottom: undefined,
    });

    const stickyStyle = computed<Record<string, string>>(() => {
        const style: Record<string, string> = { position: "sticky" };
        if (typeof props.offsetBottom === "number") {
            style.bottom = `${props.offsetBottom}px`;
        } else if (typeof props.offsetTop === "number") {
            style.top = `${props.offsetTop}px`;
        } else {
            style.top = "0px";
        }
        return style;
    });

</script>

<template>
    <!-- Affix.vue -->
    <div
        class="affix"
        :style="stickyStyle"
        :data-offset-top="offsetTop"
        :data-offset-bottom="offsetBottom"
    >
        <slot />
    </div>
</template>
