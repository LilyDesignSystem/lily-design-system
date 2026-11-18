<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GhanaCardPersonalIdentificationNumberView from "./GhanaCardPersonalIdentificationNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/GhanaCardPersonalIdentificationNumberView",
        component: GhanaCardPersonalIdentificationNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Ghana Card PIN View" }}
/>
