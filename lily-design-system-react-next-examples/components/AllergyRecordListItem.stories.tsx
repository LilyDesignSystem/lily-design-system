import type { Meta, StoryObj } from "@storybook/react-vite";
import AllergyRecordListItem from "./AllergyRecordListItem";

const meta = {
    title: "Headless/AllergyRecordListItem",
    component: AllergyRecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof AllergyRecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        substance: "Penicillin",
        reaction: "Anaphylaxis",
        severity: "severe",
        severityLabel: "Severe",
    },
};
