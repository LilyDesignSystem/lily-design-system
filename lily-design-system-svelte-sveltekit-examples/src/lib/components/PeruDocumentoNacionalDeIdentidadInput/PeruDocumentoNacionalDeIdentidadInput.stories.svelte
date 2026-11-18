<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PeruDocumentoNacionalDeIdentidadInput from "./PeruDocumentoNacionalDeIdentidadInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/PeruDocumentoNacionalDeIdentidadInput",
        component: PeruDocumentoNacionalDeIdentidadInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Documento Nacional de Identidad (DNI) Input" }}
/>
