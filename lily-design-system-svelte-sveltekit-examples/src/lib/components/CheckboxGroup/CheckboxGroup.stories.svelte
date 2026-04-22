<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CheckboxGroup from "./CheckboxGroup.svelte";
    const { Story } = defineMeta({
        title: "Examples/CheckboxGroup",
        component: CheckboxGroup,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <CheckboxGroup label="CheckboxGroup example">
        <span>CheckboxGroup example</span>
    </CheckboxGroup>
</Story>
