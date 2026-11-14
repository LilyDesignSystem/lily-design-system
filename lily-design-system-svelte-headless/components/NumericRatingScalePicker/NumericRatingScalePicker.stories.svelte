<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import NumericRatingScalePicker from "./NumericRatingScalePicker.svelte";
    const { Story } = defineMeta({
        title: "Headless/NumericRatingScalePicker",
        component: NumericRatingScalePicker,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <NumericRatingScalePicker label="NumericRatingScalePicker example">
        <span>NumericRatingScalePicker example</span>
    </NumericRatingScalePicker>
</Story>
