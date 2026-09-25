<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import HangukJuminDeungnokBeonhoInput from "./HangukJuminDeungnokBeonhoInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/HangukJuminDeungnokBeonhoInput",
        component: HangukJuminDeungnokBeonhoInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <HangukJuminDeungnokBeonhoInput label="HangukJuminDeungnokBeonhoInput example">
        <span>HangukJuminDeungnokBeonhoInput example</span>
    </HangukJuminDeungnokBeonhoInput>
</Story>
