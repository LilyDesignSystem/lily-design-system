import type { Meta, StoryObj } from "@storybook/vue3-vite";
import MedicationRecordListItem from "./MedicationRecordListItem.vue";

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
};
