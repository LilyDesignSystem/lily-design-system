<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IndonesiaNomorIndukKependudukanView from "./IndonesiaNomorIndukKependudukanView.svelte";
    const { Story } = defineMeta({
        title: "Headless/IndonesiaNomorIndukKependudukanView",
        component: IndonesiaNomorIndukKependudukanView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <IndonesiaNomorIndukKependudukanView label="IndonesiaNomorIndukKependudukanView example">
        <span>IndonesiaNomorIndukKependudukanView example</span>
    </IndonesiaNomorIndukKependudukanView>
</Story>
