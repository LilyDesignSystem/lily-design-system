<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AiLabel from "./AiLabel.svelte";
    const { Story } = defineMeta({
        title: "Examples/AiLabel",
        component: AiLabel,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <AiLabel label="AiLabel example">
        <span>AiLabel example</span>
    </AiLabel>
</Story>
