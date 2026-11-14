<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AllergyRecordList from "./AllergyRecordList.svelte";
    import AllergyRecordListItem from "../AllergyRecordListItem/AllergyRecordListItem.svelte";
    const { Story } = defineMeta({
        title: "Headless/AllergyRecordList",
        component: AllergyRecordList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <AllergyRecordList
        status="known"
        statusLabel="Known allergies"
    >
        <AllergyRecordListItem
            substance="Penicillin"
            reaction="Anaphylaxis"
            severity="severe"
            severityLabel="Severe"
        />
    </AllergyRecordList>
</Story>

<Story name="No known allergies">
    <AllergyRecordList
        status="none-known"
        statusLabel="No known allergies"
    />
</Story>
