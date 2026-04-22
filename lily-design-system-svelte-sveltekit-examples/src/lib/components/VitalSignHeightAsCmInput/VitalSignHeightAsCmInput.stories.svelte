<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignHeightAsCmInput from "./VitalSignHeightAsCmInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignHeightAsCmInput",
        component: VitalSignHeightAsCmInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignHeightAsCmInput label="VitalSignHeightAsCmInput example">
        <span>VitalSignHeightAsCmInput example</span>
    </VitalSignHeightAsCmInput>
</Story>
