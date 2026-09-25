<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NihonKojinBangoInput from "./NihonKojinBangoInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/NihonKojinBangoInput",
        component: NihonKojinBangoInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <NihonKojinBangoInput label="NihonKojinBangoInput example">
        <span>NihonKojinBangoInput example</span>
    </NihonKojinBangoInput>
</Story>
