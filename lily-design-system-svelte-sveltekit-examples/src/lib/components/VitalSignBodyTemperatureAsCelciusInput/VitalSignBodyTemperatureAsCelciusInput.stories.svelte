<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBodyTemperatureAsCelciusInput from "./VitalSignBodyTemperatureAsCelciusInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBodyTemperatureAsCelciusInput",
        component: VitalSignBodyTemperatureAsCelciusInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBodyTemperatureAsCelciusInput label="VitalSignBodyTemperatureAsCelciusInput example">
        <span>VitalSignBodyTemperatureAsCelciusInput example</span>
    </VitalSignBodyTemperatureAsCelciusInput>
</Story>
