<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ScreenReaderSpan from "./ScreenReaderSpan.svelte";
    const { Story } = defineMeta({
        title: "Examples/ScreenReaderSpan",
        component: ScreenReaderSpan,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ScreenReaderSpan label="ScreenReaderSpan example">
        <span>ScreenReaderSpan example</span>
    </ScreenReaderSpan>
</Story>
