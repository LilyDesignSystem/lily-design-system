<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AotearoaNationalHealthIndexInput from "./AotearoaNationalHealthIndexInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/AotearoaNationalHealthIndexInput",
        component: AotearoaNationalHealthIndexInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <AotearoaNationalHealthIndexInput label="AotearoaNationalHealthIndexInput example">
        <span>AotearoaNationalHealthIndexInput example</span>
    </AotearoaNationalHealthIndexInput>
</Story>
