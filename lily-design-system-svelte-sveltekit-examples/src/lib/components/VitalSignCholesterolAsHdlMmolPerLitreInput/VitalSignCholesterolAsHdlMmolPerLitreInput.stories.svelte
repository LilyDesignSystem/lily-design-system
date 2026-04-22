<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignCholesterolAsHdlMmolPerLitreInput from "./VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignCholesterolAsHdlMmolPerLitreInput",
        component: VitalSignCholesterolAsHdlMmolPerLitreInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignCholesterolAsHdlMmolPerLitreInput label="VitalSignCholesterolAsHdlMmolPerLitreInput example">
        <span>VitalSignCholesterolAsHdlMmolPerLitreInput example</span>
    </VitalSignCholesterolAsHdlMmolPerLitreInput>
</Story>
