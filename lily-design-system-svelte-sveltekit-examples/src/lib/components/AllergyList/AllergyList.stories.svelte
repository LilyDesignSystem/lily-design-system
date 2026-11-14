<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AllergyList from "./AllergyList.svelte";
    import AllergyListItem from "../AllergyListItem/AllergyListItem.svelte";
    const { Story } = defineMeta({
        title: "Headless/AllergyList",
        component: AllergyList,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <AllergyList
        status="known"
        statusLabel="Known allergies"
    >
        <AllergyListItem
            substance="Penicillin"
            reaction="Anaphylaxis"
            severity="severe"
            severityLabel="Severe"
        />
    </AllergyList>
</Story>

<Story name="No known allergies">
    <AllergyList
        status="none-known"
        statusLabel="No known allergies"
    />
</Story>
