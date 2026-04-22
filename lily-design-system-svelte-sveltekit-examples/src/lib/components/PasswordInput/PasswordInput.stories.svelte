<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PasswordInput from "./PasswordInput.svelte";
    const { Story } = defineMeta({
        title: "Examples/PasswordInput",
        component: PasswordInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <PasswordInput label="PasswordInput example">
        <span>PasswordInput example</span>
    </PasswordInput>
</Story>
