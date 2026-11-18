<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ItyopyaFaydaIdentificationNumberInput from "./ItyopyaFaydaIdentificationNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/ItyopyaFaydaIdentificationNumberInput",
        component: ItyopyaFaydaIdentificationNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Fayda Identification Number (FIN) Input" }}
/>
