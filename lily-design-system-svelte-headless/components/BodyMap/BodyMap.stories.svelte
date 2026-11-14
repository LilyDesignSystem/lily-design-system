<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BodyMap from "./BodyMap.svelte";
    const { Story } = defineMeta({
        title: "Headless/BodyMap",
        component: BodyMap,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <BodyMap label="BodyMap example">
        <span>BodyMap example</span>
    </BodyMap>
</Story>
