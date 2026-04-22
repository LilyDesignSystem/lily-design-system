<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignHeartRateAsBeatsPerMinuteView from "./VitalSignHeartRateAsBeatsPerMinuteView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignHeartRateAsBeatsPerMinuteView",
        component: VitalSignHeartRateAsBeatsPerMinuteView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignHeartRateAsBeatsPerMinuteView label="VitalSignHeartRateAsBeatsPerMinuteView example">
        <span>VitalSignHeartRateAsBeatsPerMinuteView example</span>
    </VitalSignHeartRateAsBeatsPerMinuteView>
</Story>
