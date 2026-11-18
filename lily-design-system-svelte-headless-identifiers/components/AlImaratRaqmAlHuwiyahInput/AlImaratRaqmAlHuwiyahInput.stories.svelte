<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AlImaratRaqmAlHuwiyahInput from "./AlImaratRaqmAlHuwiyahInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/AlImaratRaqmAlHuwiyahInput",
        component: AlImaratRaqmAlHuwiyahInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Emirates ID number Input" }}
/>
