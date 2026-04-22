<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignVo2MaxAsMlPerKgPerMinuteView from "./VitalSignVo2MaxAsMlPerKgPerMinuteView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignVo2MaxAsMlPerKgPerMinuteView",
        component: VitalSignVo2MaxAsMlPerKgPerMinuteView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignVo2MaxAsMlPerKgPerMinuteView label="VitalSignVo2MaxAsMlPerKgPerMinuteView example">
        <span>VitalSignVo2MaxAsMlPerKgPerMinuteView example</span>
    </VitalSignVo2MaxAsMlPerKgPerMinuteView>
</Story>
