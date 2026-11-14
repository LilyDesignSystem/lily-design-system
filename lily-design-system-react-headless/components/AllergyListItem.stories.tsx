import type { Meta, StoryObj } from "@storybook/react-vite";
import AllergyListItem from "./AllergyListItem";

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
