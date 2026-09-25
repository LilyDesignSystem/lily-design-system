<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BrasilCartaoNacionalDeSaudeView from "./BrasilCartaoNacionalDeSaudeView.svelte";
    const { Story } = defineMeta({
        title: "Headless/BrasilCartaoNacionalDeSaudeView",
        component: BrasilCartaoNacionalDeSaudeView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <BrasilCartaoNacionalDeSaudeView label="BrasilCartaoNacionalDeSaudeView example">
        <span>BrasilCartaoNacionalDeSaudeView example</span>
    </BrasilCartaoNacionalDeSaudeView>
</Story>
