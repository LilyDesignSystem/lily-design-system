<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignRespiratoryRateAsBreathsPerMinuteView from "./VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignRespiratoryRateAsBreathsPerMinuteView",
        component: VitalSignRespiratoryRateAsBreathsPerMinuteView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignRespiratoryRateAsBreathsPerMinuteView label="VitalSignRespiratoryRateAsBreathsPerMinuteView example">
        <span>VitalSignRespiratoryRateAsBreathsPerMinuteView example</span>
    </VitalSignRespiratoryRateAsBreathsPerMinuteView>
</Story>
