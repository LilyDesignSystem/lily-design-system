<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignHeartRateAsBeatsPerMinuteInput from "./VitalSignHeartRateAsBeatsPerMinuteInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignHeartRateAsBeatsPerMinuteInput",
        component: VitalSignHeartRateAsBeatsPerMinuteInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignHeartRateAsBeatsPerMinuteInput label="VitalSignHeartRateAsBeatsPerMinuteInput example">
        <span>VitalSignHeartRateAsBeatsPerMinuteInput example</span>
    </VitalSignHeartRateAsBeatsPerMinuteInput>
</Story>
