<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BharatAadhaarInput from "./BharatAadhaarInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/BharatAadhaarInput",
        component: BharatAadhaarInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <BharatAadhaarInput label="BharatAadhaarInput example">
        <span>BharatAadhaarInput example</span>
    </BharatAadhaarInput>
</Story>
