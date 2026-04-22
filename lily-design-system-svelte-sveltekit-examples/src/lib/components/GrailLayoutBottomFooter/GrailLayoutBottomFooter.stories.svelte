<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GrailLayoutBottomFooter from "./GrailLayoutBottomFooter.svelte";
    const { Story } = defineMeta({
        title: "Examples/GrailLayoutBottomFooter",
        component: GrailLayoutBottomFooter,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <GrailLayoutBottomFooter label="GrailLayoutBottomFooter example">
        <span>GrailLayoutBottomFooter example</span>
    </GrailLayoutBottomFooter>
</Story>
