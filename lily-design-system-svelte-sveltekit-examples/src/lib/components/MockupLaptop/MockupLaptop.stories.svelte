<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupLaptop from "./MockupLaptop.svelte";
    const { Story } = defineMeta({
        title: "Examples/MockupLaptop",
        component: MockupLaptop,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupLaptop label="MockupLaptop example">
        <span>MockupLaptop example</span>
    </MockupLaptop>
</Story>
