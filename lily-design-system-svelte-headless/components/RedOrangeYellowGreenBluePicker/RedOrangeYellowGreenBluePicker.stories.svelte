<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RedOrangeYellowGreenBluePicker from "./RedOrangeYellowGreenBluePicker.svelte";

    const LABELS = {
        red: "Severe",
        orange: "High",
        yellow: "Medium",
        green: "Low",
        blue: "Informational",
    };

    const { Story } = defineMeta({
        title: "Headless/RedOrangeYellowGreenBluePicker",
        component: RedOrangeYellowGreenBluePicker,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{
        label: "Risk level",
        statusLabel: (status: string) => (LABELS as Record<string, string>)[status],
    }}
/>
