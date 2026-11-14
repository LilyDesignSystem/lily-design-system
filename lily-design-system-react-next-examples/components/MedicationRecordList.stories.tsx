import type { Meta, StoryObj } from "@storybook/react-vite";
import MedicationRecordList from "./MedicationRecordList";
import MedicationRecordListItem from "./MedicationRecordListItem";

const meta = {
    title: "Headless/MedicationRecordList",
    component: MedicationRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof MedicationRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Current medicines" },
    render: (args) => (
        <MedicationRecordList {...args}>
            <MedicationRecordListItem
                status="active"
                statusLabel="Active"
                effective="2025-03-03"
                effectiveLabel="Since 3 Mar 2025"
            >
                ramipril 5 mg capsule, oral, once a day
            </MedicationRecordListItem>
        </MedicationRecordList>
    ),
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known medicines" },
};
