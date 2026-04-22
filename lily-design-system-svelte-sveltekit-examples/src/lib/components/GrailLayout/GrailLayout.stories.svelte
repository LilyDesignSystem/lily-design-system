<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GrailLayout from "./GrailLayout.svelte";
    const { Story } = defineMeta({
        title: "Examples/GrailLayout",
        component: GrailLayout,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <GrailLayout label="GrailLayout example">
        <span>GrailLayout example</span>
    </GrailLayout>
</Story>
