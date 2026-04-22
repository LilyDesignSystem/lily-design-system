<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import VitalSignBodyFatAsPercentageView from "./VitalSignBodyFatAsPercentageView.svelte";
    const { Story } = defineMeta({
        title: "Examples/VitalSignBodyFatAsPercentageView",
        component: VitalSignBodyFatAsPercentageView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <VitalSignBodyFatAsPercentageView label="VitalSignBodyFatAsPercentageView example">
        <span>VitalSignBodyFatAsPercentageView example</span>
    </VitalSignBodyFatAsPercentageView>
</Story>
