<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SriLankaNationalIdentityCardView from "./SriLankaNationalIdentityCardView.svelte";

    const { Story } = defineMeta({
        title: "Headless/SriLankaNationalIdentityCardView",
        component: SriLankaNationalIdentityCardView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identity Card (NIC) number View" }}
/>
