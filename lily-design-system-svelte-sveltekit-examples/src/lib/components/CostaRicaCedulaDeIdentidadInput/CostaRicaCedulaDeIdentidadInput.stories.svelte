<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CostaRicaCedulaDeIdentidadInput from "./CostaRicaCedulaDeIdentidadInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/CostaRicaCedulaDeIdentidadInput",
        component: CostaRicaCedulaDeIdentidadInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cédula de Identidad Input" }}
/>
