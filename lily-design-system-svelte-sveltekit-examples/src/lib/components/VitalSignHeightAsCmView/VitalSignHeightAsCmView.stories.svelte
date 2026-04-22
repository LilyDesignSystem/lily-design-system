<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignHeightAsCmView from "./VitalSignHeightAsCmView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignHeightAsCmView",
        component: VitalSignHeightAsCmView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignHeightAsCmView label="VitalSignHeightAsCmView example">
        <span>VitalSignHeightAsCmView example</span>
    </VitalSignHeightAsCmView>
</Story>
