<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
        component: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Personal identification number (JShShIR / PINFL) Input" }}
/>
