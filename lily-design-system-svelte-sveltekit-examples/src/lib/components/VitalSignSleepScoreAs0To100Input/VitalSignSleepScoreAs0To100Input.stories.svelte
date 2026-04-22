<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignSleepScoreAs0To100Input from "./VitalSignSleepScoreAs0To100Input.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignSleepScoreAs0To100Input",
        component: VitalSignSleepScoreAs0To100Input,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignSleepScoreAs0To100Input label="VitalSignSleepScoreAs0To100Input example">
        <span>VitalSignSleepScoreAs0To100Input example</span>
    </VitalSignSleepScoreAs0To100Input>
</Story>
