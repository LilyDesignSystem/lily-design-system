<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableCol from "./TableCol.svelte";
    const { Story } = defineMeta({
        title: "Examples/TableCol",
        component: TableCol,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableCol label="TableCol example">
        <span>TableCol example</span>
    </TableCol>
</Story>
