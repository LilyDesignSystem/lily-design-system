import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AllergyListItem from "./AllergyListItem.vue";

const meta = {
    title: "Headless/AllergyListItem",
    component: AllergyListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof AllergyListItem>;

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
