<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RepublicaDominicanaCedulaDeIdentidadYElectoralView from "./RepublicaDominicanaCedulaDeIdentidadYElectoralView.svelte";

    const { Story } = defineMeta({
        title: "Headless/RepublicaDominicanaCedulaDeIdentidadYElectoralView",
        component: RepublicaDominicanaCedulaDeIdentidadYElectoralView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cédula de Identidad y Electoral View" }}
/>
