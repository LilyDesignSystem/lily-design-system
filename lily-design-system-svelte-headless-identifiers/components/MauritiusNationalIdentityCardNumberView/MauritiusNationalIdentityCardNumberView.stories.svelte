<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MauritiusNationalIdentityCardNumberView from "./MauritiusNationalIdentityCardNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/MauritiusNationalIdentityCardNumberView",
        component: MauritiusNationalIdentityCardNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identity Card number View" }}
/>
