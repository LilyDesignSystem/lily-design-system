<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignWaistCircumferenceAsCmInput from "./VitalSignWaistCircumferenceAsCmInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignWaistCircumferenceAsCmInput",
        component: VitalSignWaistCircumferenceAsCmInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignWaistCircumferenceAsCmInput label="VitalSignWaistCircumferenceAsCmInput example">
        <span>VitalSignWaistCircumferenceAsCmInput example</span>
    </VitalSignWaistCircumferenceAsCmInput>
</Story>
