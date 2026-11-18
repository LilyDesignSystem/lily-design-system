<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MauritiusNationalIdentityCardNumberInput from "./MauritiusNationalIdentityCardNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/MauritiusNationalIdentityCardNumberInput",
        component: MauritiusNationalIdentityCardNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "National Identity Card number Input" }}
/>
