<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBodyTemperatureAsCelciusView from "./VitalSignBodyTemperatureAsCelciusView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBodyTemperatureAsCelciusView",
        component: VitalSignBodyTemperatureAsCelciusView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBodyTemperatureAsCelciusView label="VitalSignBodyTemperatureAsCelciusView example">
        <span>VitalSignBodyTemperatureAsCelciusView example</span>
    </VitalSignBodyTemperatureAsCelciusView>
</Story>
