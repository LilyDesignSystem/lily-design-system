import type { Meta, StoryObj } from "@storybook/angular";
import { AllergyRecordListItem } from "./AllergyRecordListItem";

const meta: Meta<AllergyRecordListItem> = {
    title: "Headless/AllergyRecordListItem",
    component: AllergyRecordListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AllergyRecordListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-allergy-record-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severityLabel="Severe"></li></ul>`,
    }),
};
