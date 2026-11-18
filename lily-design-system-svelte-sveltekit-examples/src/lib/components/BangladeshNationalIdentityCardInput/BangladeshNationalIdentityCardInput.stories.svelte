<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BangladeshNationalIdentityCardInput from "./BangladeshNationalIdentityCardInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/BangladeshNationalIdentityCardInput",
        component: BangladeshNationalIdentityCardInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National ID (NID) number Input" }}
/>
