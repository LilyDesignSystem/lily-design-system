<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ItyopyaFaydaIdentificationNumberView from "./ItyopyaFaydaIdentificationNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/ItyopyaFaydaIdentificationNumberView",
        component: ItyopyaFaydaIdentificationNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Fayda Identification Number (FIN) View" }}
/>
