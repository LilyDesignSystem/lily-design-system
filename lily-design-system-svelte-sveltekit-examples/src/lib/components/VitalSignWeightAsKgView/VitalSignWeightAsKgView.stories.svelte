<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignWeightAsKgView from "./VitalSignWeightAsKgView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignWeightAsKgView",
        component: VitalSignWeightAsKgView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignWeightAsKgView label="VitalSignWeightAsKgView example">
        <span>VitalSignWeightAsKgView example</span>
    </VitalSignWeightAsKgView>
</Story>
