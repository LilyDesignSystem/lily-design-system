<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MagyarorszagTajSzamView from "./MagyarorszagTajSzamView.svelte";
    const { Story } = defineMeta({
        title: "Headless/MagyarorszagTajSzamView",
        component: MagyarorszagTajSzamView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MagyarorszagTajSzamView label="MagyarorszagTajSzamView example">
        <span>MagyarorszagTajSzamView example</span>
    </MagyarorszagTajSzamView>
</Story>
