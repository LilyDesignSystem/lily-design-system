import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AllergyRecordListItem from "./AllergyRecordListItem.vue";

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
