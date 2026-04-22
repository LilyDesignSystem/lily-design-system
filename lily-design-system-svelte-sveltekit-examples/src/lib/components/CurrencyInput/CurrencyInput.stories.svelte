<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CurrencyInput from "./CurrencyInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/CurrencyInput",
        component: CurrencyInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <CurrencyInput label="CurrencyInput example">
        <span>CurrencyInput example</span>
    </CurrencyInput>
</Story>
