<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignRespiratoryRateAsBreathsPerMinuteInput from "./VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignRespiratoryRateAsBreathsPerMinuteInput",
        component: VitalSignRespiratoryRateAsBreathsPerMinuteInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignRespiratoryRateAsBreathsPerMinuteInput label="VitalSignRespiratoryRateAsBreathsPerMinuteInput example">
        <span>VitalSignRespiratoryRateAsBreathsPerMinuteInput example</span>
    </VitalSignRespiratoryRateAsBreathsPerMinuteInput>
</Story>
