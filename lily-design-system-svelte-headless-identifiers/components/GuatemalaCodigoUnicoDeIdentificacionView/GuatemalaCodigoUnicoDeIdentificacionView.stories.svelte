<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GuatemalaCodigoUnicoDeIdentificacionView from "./GuatemalaCodigoUnicoDeIdentificacionView.svelte";

    const { Story } = defineMeta({
        title: "Headless/GuatemalaCodigoUnicoDeIdentificacionView",
        component: GuatemalaCodigoUnicoDeIdentificacionView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Código Único de Identificación (CUI) View" }}
/>
