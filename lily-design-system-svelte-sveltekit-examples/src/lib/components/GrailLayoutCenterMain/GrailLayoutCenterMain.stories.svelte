<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GrailLayoutCenterMain from "./GrailLayoutCenterMain.svelte";
    const { Story } = defineMeta({
        title: "Examples/GrailLayoutCenterMain",
        component: GrailLayoutCenterMain,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <GrailLayoutCenterMain label="GrailLayoutCenterMain example">
        <span>GrailLayoutCenterMain example</span>
    </GrailLayoutCenterMain>
</Story>
