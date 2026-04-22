<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBloodPressureSystolicAsMmhgInput from "./VitalSignBloodPressureSystolicAsMmhgInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBloodPressureSystolicAsMmhgInput",
        component: VitalSignBloodPressureSystolicAsMmhgInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBloodPressureSystolicAsMmhgInput label="VitalSignBloodPressureSystolicAsMmhgInput example">
        <span>VitalSignBloodPressureSystolicAsMmhgInput example</span>
    </VitalSignBloodPressureSystolicAsMmhgInput>
</Story>
