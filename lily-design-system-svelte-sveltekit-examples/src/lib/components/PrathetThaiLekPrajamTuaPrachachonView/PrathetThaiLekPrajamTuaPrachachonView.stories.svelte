<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PrathetThaiLekPrajamTuaPrachachonView from "./PrathetThaiLekPrajamTuaPrachachonView.svelte";
    const { Story } = defineMeta({
        title: "Headless/PrathetThaiLekPrajamTuaPrachachonView",
        component: PrathetThaiLekPrajamTuaPrachachonView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <PrathetThaiLekPrajamTuaPrachachonView label="PrathetThaiLekPrajamTuaPrachachonView example">
        <span>PrathetThaiLekPrajamTuaPrachachonView example</span>
    </PrathetThaiLekPrajamTuaPrachachonView>
</Story>
