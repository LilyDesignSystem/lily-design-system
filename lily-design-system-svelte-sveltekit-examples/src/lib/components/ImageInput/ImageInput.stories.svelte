<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ImageInput from "./ImageInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/ImageInput",
        component: ImageInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ImageInput label="ImageInput example">
        <span>ImageInput example</span>
    </ImageInput>
</Story>
