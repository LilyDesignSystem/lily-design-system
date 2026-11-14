import type { Meta, StoryObj } from "@storybook/react-vite";
import RecordListItem from "./RecordListItem";

const meta = {
    title: "Headless/RecordListItem",
    component: RecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof RecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        status: "final",
        statusLabel: "Final",
        updated: "2026-11-03",
        updatedLabel: "Updated 3 Nov 2026",
    },
    render: (args) => (
        <ul>
            <RecordListItem {...args}>Blood pressure 128/82 mmHg</RecordListItem>
        </ul>
    ),
};
