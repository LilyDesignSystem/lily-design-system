<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import QazaqstanZhekeSaikestendiruNomiriView from "./QazaqstanZhekeSaikestendiruNomiriView.svelte";

    const { Story } = defineMeta({
        title: "Headless/QazaqstanZhekeSaikestendiruNomiriView",
        component: QazaqstanZhekeSaikestendiruNomiriView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Individual Identification Number (IIN) View" }}
/>
