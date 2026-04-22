<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignWaistCircumferenceAsCmView from "./VitalSignWaistCircumferenceAsCmView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignWaistCircumferenceAsCmView",
        component: VitalSignWaistCircumferenceAsCmView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignWaistCircumferenceAsCmView label="VitalSignWaistCircumferenceAsCmView example">
        <span>VitalSignWaistCircumferenceAsCmView example</span>
    </VitalSignWaistCircumferenceAsCmView>
</Story>
