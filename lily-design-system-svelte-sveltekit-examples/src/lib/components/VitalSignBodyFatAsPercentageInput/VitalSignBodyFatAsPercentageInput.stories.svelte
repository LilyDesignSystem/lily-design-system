<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBodyFatAsPercentageInput from "./VitalSignBodyFatAsPercentageInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBodyFatAsPercentageInput",
        component: VitalSignBodyFatAsPercentageInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBodyFatAsPercentageInput label="VitalSignBodyFatAsPercentageInput example">
        <span>VitalSignBodyFatAsPercentageInput example</span>
    </VitalSignBodyFatAsPercentageInput>
</Story>
