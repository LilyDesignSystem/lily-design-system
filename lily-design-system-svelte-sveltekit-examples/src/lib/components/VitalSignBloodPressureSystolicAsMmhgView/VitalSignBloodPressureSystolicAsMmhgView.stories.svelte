<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBloodPressureSystolicAsMmhgView from "./VitalSignBloodPressureSystolicAsMmhgView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBloodPressureSystolicAsMmhgView",
        component: VitalSignBloodPressureSystolicAsMmhgView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBloodPressureSystolicAsMmhgView label="VitalSignBloodPressureSystolicAsMmhgView example">
        <span>VitalSignBloodPressureSystolicAsMmhgView example</span>
    </VitalSignBloodPressureSystolicAsMmhgView>
</Story>
