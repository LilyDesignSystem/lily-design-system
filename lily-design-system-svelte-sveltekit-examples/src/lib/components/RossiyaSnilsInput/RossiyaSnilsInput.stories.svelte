<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RossiyaSnilsInput from "./RossiyaSnilsInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/RossiyaSnilsInput",
        component: RossiyaSnilsInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <RossiyaSnilsInput label="RossiyaSnilsInput example">
        <span>RossiyaSnilsInput example</span>
    </RossiyaSnilsInput>
</Story>
