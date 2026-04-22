<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignCholesterolAsLdlMmolPerLitreInput from "./VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignCholesterolAsLdlMmolPerLitreInput",
        component: VitalSignCholesterolAsLdlMmolPerLitreInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignCholesterolAsLdlMmolPerLitreInput label="VitalSignCholesterolAsLdlMmolPerLitreInput example">
        <span>VitalSignCholesterolAsLdlMmolPerLitreInput example</span>
    </VitalSignCholesterolAsLdlMmolPerLitreInput>
</Story>
