<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignCholesterolAsLdlMmolPerLitreView from "./VitalSignCholesterolAsLdlMmolPerLitreView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignCholesterolAsLdlMmolPerLitreView",
        component: VitalSignCholesterolAsLdlMmolPerLitreView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignCholesterolAsLdlMmolPerLitreView label="VitalSignCholesterolAsLdlMmolPerLitreView example">
        <span>VitalSignCholesterolAsLdlMmolPerLitreView example</span>
    </VitalSignCholesterolAsLdlMmolPerLitreView>
</Story>
