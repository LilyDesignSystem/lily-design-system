<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ZhongguoJuminShenfenzhengHaomaView from "./ZhongguoJuminShenfenzhengHaomaView.svelte";
    const { Story } = defineMeta({
        title: "Headless/ZhongguoJuminShenfenzhengHaomaView",
        component: ZhongguoJuminShenfenzhengHaomaView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ZhongguoJuminShenfenzhengHaomaView label="ZhongguoJuminShenfenzhengHaomaView example">
        <span>ZhongguoJuminShenfenzhengHaomaView example</span>
    </ZhongguoJuminShenfenzhengHaomaView>
</Story>
