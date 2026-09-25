<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import OsterreichSozialversicherungsnummerView from "./OsterreichSozialversicherungsnummerView.svelte";
    const { Story } = defineMeta({
        title: "Headless/OsterreichSozialversicherungsnummerView",
        component: OsterreichSozialversicherungsnummerView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <OsterreichSozialversicherungsnummerView label="OsterreichSozialversicherungsnummerView example">
        <span>OsterreichSozialversicherungsnummerView example</span>
    </OsterreichSozialversicherungsnummerView>
</Story>
