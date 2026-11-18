<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RepublicaDominicanaCedulaDeIdentidadYElectoralInput from "./RepublicaDominicanaCedulaDeIdentidadYElectoralInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/RepublicaDominicanaCedulaDeIdentidadYElectoralInput",
        component: RepublicaDominicanaCedulaDeIdentidadYElectoralInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cédula de Identidad y Electoral Input" }}
/>
