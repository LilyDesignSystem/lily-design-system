<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SriLankaNationalIdentityCardInput from "./SriLankaNationalIdentityCardInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/SriLankaNationalIdentityCardInput",
        component: SriLankaNationalIdentityCardInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identity Card (NIC) number Input" }}
/>
