<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignHeartRateVariabilityInput from "./VitalSignHeartRateVariabilityInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignHeartRateVariabilityInput",
        component: VitalSignHeartRateVariabilityInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignHeartRateVariabilityInput label="VitalSignHeartRateVariabilityInput example">
        <span>VitalSignHeartRateVariabilityInput example</span>
    </VitalSignHeartRateVariabilityInput>
</Story>
