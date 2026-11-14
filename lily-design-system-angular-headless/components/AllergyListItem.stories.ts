import type { Meta, StoryObj } from "@storybook/angular";
import { AllergyListItem } from "./AllergyListItem";

const meta: Meta<AllergyListItem> = {
    title: "Headless/AllergyListItem",
    component: AllergyListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AllergyListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-allergy-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severityLabel="Severe"></li></ul>`,
    }),
};
