<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CostaRicaCedulaDeIdentidadView from "./CostaRicaCedulaDeIdentidadView.svelte";

    const { Story } = defineMeta({
        title: "Headless/CostaRicaCedulaDeIdentidadView",
        component: CostaRicaCedulaDeIdentidadView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cédula de Identidad View" }}
/>
