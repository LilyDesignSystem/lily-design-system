import type { Meta, StoryObj } from "@storybook/angular";
import { MedicationRecordListItem } from "./MedicationRecordListItem";

const meta: Meta<MedicationRecordListItem> = {
    title: "Headless/MedicationRecordListItem",
    component: MedicationRecordListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MedicationRecordListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-medication-record-list-item status="active" statusLabel="Active" effective="2025-03-03" effectiveLabel="Since 3 Mar 2025">ramipril 5 mg capsule, oral, once a day</li></ul>`,
    }),
};
