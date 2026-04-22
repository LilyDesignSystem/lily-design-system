<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignTotalSleepTimeAsMinPerDayView from "./VitalSignTotalSleepTimeAsMinPerDayView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignTotalSleepTimeAsMinPerDayView",
        component: VitalSignTotalSleepTimeAsMinPerDayView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignTotalSleepTimeAsMinPerDayView label="VitalSignTotalSleepTimeAsMinPerDayView example">
        <span>VitalSignTotalSleepTimeAsMinPerDayView example</span>
    </VitalSignTotalSleepTimeAsMinPerDayView>
</Story>
