<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignTotalSleepTimeAsMinPerDayInput from "./VitalSignTotalSleepTimeAsMinPerDayInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignTotalSleepTimeAsMinPerDayInput",
        component: VitalSignTotalSleepTimeAsMinPerDayInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignTotalSleepTimeAsMinPerDayInput label="VitalSignTotalSleepTimeAsMinPerDayInput example">
        <span>VitalSignTotalSleepTimeAsMinPerDayInput example</span>
    </VitalSignTotalSleepTimeAsMinPerDayInput>
</Story>
