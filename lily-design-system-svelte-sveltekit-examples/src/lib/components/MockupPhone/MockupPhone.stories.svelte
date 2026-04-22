<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupPhone from "./MockupPhone.svelte";
    const { Story } = defineMeta({
        title: "Examples/MockupPhone",
        component: MockupPhone,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupPhone label="MockupPhone example">
        <span>MockupPhone example</span>
    </MockupPhone>
</Story>
