<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignSleepScoreAs0To100View from "./VitalSignSleepScoreAs0To100View.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignSleepScoreAs0To100View",
        component: VitalSignSleepScoreAs0To100View,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignSleepScoreAs0To100View label="VitalSignSleepScoreAs0To100View example">
        <span>VitalSignSleepScoreAs0To100View example</span>
    </VitalSignSleepScoreAs0To100View>
</Story>
