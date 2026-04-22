<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignHeartRateVariabilityView from "./VitalSignHeartRateVariabilityView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignHeartRateVariabilityView",
        component: VitalSignHeartRateVariabilityView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignHeartRateVariabilityView label="VitalSignHeartRateVariabilityView example">
        <span>VitalSignHeartRateVariabilityView example</span>
    </VitalSignHeartRateVariabilityView>
</Story>
