<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignWeightAsKgInput from "./VitalSignWeightAsKgInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignWeightAsKgInput",
        component: VitalSignWeightAsKgInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignWeightAsKgInput label="VitalSignWeightAsKgInput example">
        <span>VitalSignWeightAsKgInput example</span>
    </VitalSignWeightAsKgInput>
</Story>
