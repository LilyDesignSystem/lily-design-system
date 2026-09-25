<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import IndonesiaNomorIndukKependudukanInput from "./IndonesiaNomorIndukKependudukanInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/IndonesiaNomorIndukKependudukanInput",
        component: IndonesiaNomorIndukKependudukanInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <IndonesiaNomorIndukKependudukanInput label="IndonesiaNomorIndukKependudukanInput example">
        <span>IndonesiaNomorIndukKependudukanInput example</span>
    </IndonesiaNomorIndukKependudukanInput>
</Story>
