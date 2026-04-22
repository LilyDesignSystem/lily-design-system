<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBloodPressureDiastolicAsMmhgView from "./VitalSignBloodPressureDiastolicAsMmhgView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBloodPressureDiastolicAsMmhgView",
        component: VitalSignBloodPressureDiastolicAsMmhgView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBloodPressureDiastolicAsMmhgView label="VitalSignBloodPressureDiastolicAsMmhgView example">
        <span>VitalSignBloodPressureDiastolicAsMmhgView example</span>
    </VitalSignBloodPressureDiastolicAsMmhgView>
</Story>
