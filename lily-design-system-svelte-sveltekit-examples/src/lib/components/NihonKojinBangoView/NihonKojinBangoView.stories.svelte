<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NihonKojinBangoView from "./NihonKojinBangoView.svelte";
    const { Story } = defineMeta({
        title: "Headless/NihonKojinBangoView",
        component: NihonKojinBangoView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <NihonKojinBangoView label="NihonKojinBangoView example">
        <span>NihonKojinBangoView example</span>
    </NihonKojinBangoView>
</Story>
