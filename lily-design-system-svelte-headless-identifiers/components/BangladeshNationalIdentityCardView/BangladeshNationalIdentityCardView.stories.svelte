<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BangladeshNationalIdentityCardView from "./BangladeshNationalIdentityCardView.svelte";

    const { Story } = defineMeta({
        title: "Headless/BangladeshNationalIdentityCardView",
        component: BangladeshNationalIdentityCardView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National ID (NID) number View" }}
/>
