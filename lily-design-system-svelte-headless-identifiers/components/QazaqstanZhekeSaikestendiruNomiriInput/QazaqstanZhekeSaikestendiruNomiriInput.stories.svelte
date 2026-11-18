<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import QazaqstanZhekeSaikestendiruNomiriInput from "./QazaqstanZhekeSaikestendiruNomiriInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/QazaqstanZhekeSaikestendiruNomiriInput",
        component: QazaqstanZhekeSaikestendiruNomiriInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Individual Identification Number (IIN) Input" }}
/>
