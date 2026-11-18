<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GhanaCardPersonalIdentificationNumberInput from "./GhanaCardPersonalIdentificationNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/GhanaCardPersonalIdentificationNumberInput",
        component: GhanaCardPersonalIdentificationNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Ghana Card PIN Input" }}
/>
