<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableData from "./TableData.svelte";
    const { Story } = defineMeta({
        title: "Examples/TableData",
        component: TableData,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableData label="TableData example">
        <span>TableData example</span>
    </TableData>
</Story>
