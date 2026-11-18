<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AlImaratRaqmAlHuwiyahView from "./AlImaratRaqmAlHuwiyahView.svelte";

    const { Story } = defineMeta({
        title: "Headless/AlImaratRaqmAlHuwiyahView",
        component: AlImaratRaqmAlHuwiyahView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Emirates ID number View" }}
/>
