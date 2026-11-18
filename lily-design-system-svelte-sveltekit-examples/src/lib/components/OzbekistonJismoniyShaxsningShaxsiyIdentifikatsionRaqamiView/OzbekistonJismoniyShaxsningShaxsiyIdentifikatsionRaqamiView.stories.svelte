<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView.svelte";

    const { Story } = defineMeta({
        title: "Headless/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView",
        component: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Personal identification number (JShShIR / PINFL) View" }}
/>
