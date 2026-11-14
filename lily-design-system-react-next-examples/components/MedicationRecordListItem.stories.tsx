import type { Meta, StoryObj } from "@storybook/react-vite";
import MedicationRecordListItem from "./MedicationRecordListItem";

const meta = {
    title: "Headless/MedicationRecordListItem",
    component: MedicationRecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof MedicationRecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        status: "active",
        statusLabel: "Active",
        effective: "2025-03-03",
        effectiveLabel: "Since 3 Mar 2025",
    },
    render: (args) => (
        <ul>
            <MedicationRecordListItem {...args}>
                ramipril 5 mg capsule, oral, once a day
            </MedicationRecordListItem>
        </ul>
    ),
};
