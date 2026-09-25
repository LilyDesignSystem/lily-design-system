<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SouthAfricaIdentityNumberView from "./SouthAfricaIdentityNumberView.svelte";
    const { Story } = defineMeta({
        title: "Headless/SouthAfricaIdentityNumberView",
        component: SouthAfricaIdentityNumberView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <SouthAfricaIdentityNumberView label="SouthAfricaIdentityNumberView example">
        <span>SouthAfricaIdentityNumberView example</span>
    </SouthAfricaIdentityNumberView>
</Story>
