<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GuatemalaCodigoUnicoDeIdentificacionInput from "./GuatemalaCodigoUnicoDeIdentificacionInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/GuatemalaCodigoUnicoDeIdentificacionInput",
        component: GuatemalaCodigoUnicoDeIdentificacionInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Código Único de Identificación (CUI) Input" }}
/>
