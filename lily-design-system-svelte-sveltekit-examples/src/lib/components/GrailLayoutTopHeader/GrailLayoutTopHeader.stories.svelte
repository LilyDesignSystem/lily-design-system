<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GrailLayoutTopHeader from "./GrailLayoutTopHeader.svelte";
    const { Story } = defineMeta({
        title: "Examples/GrailLayoutTopHeader",
        component: GrailLayoutTopHeader,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <GrailLayoutTopHeader label="GrailLayoutTopHeader example">
        <span>GrailLayoutTopHeader example</span>
    </GrailLayoutTopHeader>
</Story>
