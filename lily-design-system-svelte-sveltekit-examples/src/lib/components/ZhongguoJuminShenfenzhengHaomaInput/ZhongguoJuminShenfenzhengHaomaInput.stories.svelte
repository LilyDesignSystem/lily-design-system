<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ZhongguoJuminShenfenzhengHaomaInput from "./ZhongguoJuminShenfenzhengHaomaInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/ZhongguoJuminShenfenzhengHaomaInput",
        component: ZhongguoJuminShenfenzhengHaomaInput,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ZhongguoJuminShenfenzhengHaomaInput label="ZhongguoJuminShenfenzhengHaomaInput example">
        <span>ZhongguoJuminShenfenzhengHaomaInput example</span>
    </ZhongguoJuminShenfenzhengHaomaInput>
</Story>
