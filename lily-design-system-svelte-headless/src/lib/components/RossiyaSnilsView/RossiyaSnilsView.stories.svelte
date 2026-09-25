<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RossiyaSnilsView from "./RossiyaSnilsView.svelte";
    const { Story } = defineMeta({
        title: "Headless/RossiyaSnilsView",
        component: RossiyaSnilsView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <RossiyaSnilsView label="RossiyaSnilsView example">
        <span>RossiyaSnilsView example</span>
    </RossiyaSnilsView>
</Story>
