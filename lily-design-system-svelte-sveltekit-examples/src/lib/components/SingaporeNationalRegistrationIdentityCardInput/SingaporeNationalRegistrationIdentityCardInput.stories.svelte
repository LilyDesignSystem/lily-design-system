<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SingaporeNationalRegistrationIdentityCardInput from "./SingaporeNationalRegistrationIdentityCardInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/SingaporeNationalRegistrationIdentityCardInput",
        component: SingaporeNationalRegistrationIdentityCardInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <SingaporeNationalRegistrationIdentityCardInput label="SingaporeNationalRegistrationIdentityCardInput example">
        <span>SingaporeNationalRegistrationIdentityCardInput example</span>
    </SingaporeNationalRegistrationIdentityCardInput>
</Story>
