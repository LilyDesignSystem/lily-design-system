<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AllergyListItem from "./AllergyListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/AllergyListItem",
        component: AllergyListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <AllergyListItem
            substance="Penicillin"
            reaction="Anaphylaxis"
            severity="severe"
            severityLabel="Severe"
            updated="2026-11-03"
            updatedLabel="Updated 3 Nov 2026"
        />
    </ul>
</Story>
