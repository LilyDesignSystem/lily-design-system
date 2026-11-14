<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AllergyRecordListItem from "./AllergyRecordListItem.svelte";

    const { Story } = defineMeta({
        title: "Headless/AllergyRecordListItem",
        component: AllergyRecordListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ul>
        <AllergyRecordListItem
            substance="Penicillin"
            reaction="Anaphylaxis"
            severity="severe"
            severityLabel="Severe"
            updated="2026-11-03"
            updatedLabel="Updated 3 Nov 2026"
        />
    </ul>
</Story>
