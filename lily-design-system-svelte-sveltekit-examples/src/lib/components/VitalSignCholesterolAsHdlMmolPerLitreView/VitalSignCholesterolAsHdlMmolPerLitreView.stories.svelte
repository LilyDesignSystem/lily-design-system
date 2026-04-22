<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignCholesterolAsHdlMmolPerLitreView from "./VitalSignCholesterolAsHdlMmolPerLitreView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignCholesterolAsHdlMmolPerLitreView",
        component: VitalSignCholesterolAsHdlMmolPerLitreView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignCholesterolAsHdlMmolPerLitreView label="VitalSignCholesterolAsHdlMmolPerLitreView example">
        <span>VitalSignCholesterolAsHdlMmolPerLitreView example</span>
    </VitalSignCholesterolAsHdlMmolPerLitreView>
</Story>
