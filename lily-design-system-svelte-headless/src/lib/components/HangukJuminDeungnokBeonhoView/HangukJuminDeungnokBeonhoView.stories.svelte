<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import HangukJuminDeungnokBeonhoView from "./HangukJuminDeungnokBeonhoView.svelte";
    const { Story } = defineMeta({
        title: "Headless/HangukJuminDeungnokBeonhoView",
        component: HangukJuminDeungnokBeonhoView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <HangukJuminDeungnokBeonhoView label="HangukJuminDeungnokBeonhoView example">
        <span>HangukJuminDeungnokBeonhoView example</span>
    </HangukJuminDeungnokBeonhoView>
</Story>
