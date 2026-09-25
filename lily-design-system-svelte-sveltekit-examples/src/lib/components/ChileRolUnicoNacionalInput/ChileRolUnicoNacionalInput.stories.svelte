<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChileRolUnicoNacionalInput from "./ChileRolUnicoNacionalInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/ChileRolUnicoNacionalInput",
        component: ChileRolUnicoNacionalInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ChileRolUnicoNacionalInput label="ChileRolUnicoNacionalInput example">
        <span>ChileRolUnicoNacionalInput example</span>
    </ChileRolUnicoNacionalInput>
</Story>
