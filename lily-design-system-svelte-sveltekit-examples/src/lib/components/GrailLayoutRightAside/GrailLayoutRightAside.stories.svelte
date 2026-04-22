<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GrailLayoutRightAside from "./GrailLayoutRightAside.svelte";
    const { Story } = defineMeta({
        title: "Examples/GrailLayoutRightAside",
        component: GrailLayoutRightAside,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <GrailLayoutRightAside label="GrailLayoutRightAside example">
        <span>GrailLayoutRightAside example</span>
    </GrailLayoutRightAside>
</Story>
