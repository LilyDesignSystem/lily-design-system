<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GrailLayoutLeftAside from "./GrailLayoutLeftAside.svelte";
    const { Story } = defineMeta({
        title: "Examples/GrailLayoutLeftAside",
        component: GrailLayoutLeftAside,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <GrailLayoutLeftAside label="GrailLayoutLeftAside example">
        <span>GrailLayoutLeftAside example</span>
    </GrailLayoutLeftAside>
</Story>
