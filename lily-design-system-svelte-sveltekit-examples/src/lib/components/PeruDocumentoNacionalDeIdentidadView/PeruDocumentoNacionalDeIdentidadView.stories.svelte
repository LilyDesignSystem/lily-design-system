<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PeruDocumentoNacionalDeIdentidadView from "./PeruDocumentoNacionalDeIdentidadView.svelte";

    const { Story } = defineMeta({
        title: "Headless/PeruDocumentoNacionalDeIdentidadView",
        component: PeruDocumentoNacionalDeIdentidadView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Documento Nacional de Identidad (DNI) View" }}
/>
