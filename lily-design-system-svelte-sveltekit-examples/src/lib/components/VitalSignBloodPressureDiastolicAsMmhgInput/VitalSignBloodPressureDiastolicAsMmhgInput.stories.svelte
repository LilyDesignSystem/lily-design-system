<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBloodPressureDiastolicAsMmhgInput from "./VitalSignBloodPressureDiastolicAsMmhgInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBloodPressureDiastolicAsMmhgInput",
        component: VitalSignBloodPressureDiastolicAsMmhgInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBloodPressureDiastolicAsMmhgInput label="VitalSignBloodPressureDiastolicAsMmhgInput example">
        <span>VitalSignBloodPressureDiastolicAsMmhgInput example</span>
    </VitalSignBloodPressureDiastolicAsMmhgInput>
</Story>
