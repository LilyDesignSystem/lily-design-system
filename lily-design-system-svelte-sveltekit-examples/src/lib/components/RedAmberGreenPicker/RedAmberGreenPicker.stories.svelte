<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RedAmberGreenPicker from "./RedAmberGreenPicker.svelte";

    const LABELS = { red: "Off track", amber: "At risk", green: "On track" };

    const { Story } = defineMeta({
        title: "Headless/RedAmberGreenPicker",
        component: RedAmberGreenPicker,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{
        label: "Project status",
        statusLabel: (status: string) => (LABELS as Record<string, string>)[status],
    }}
/>
