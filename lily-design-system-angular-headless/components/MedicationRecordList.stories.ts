import type { Meta, StoryObj } from "@storybook/angular";
import { MedicationRecordList } from "./MedicationRecordList";

const meta: Meta<MedicationRecordList> = {
    title: "Headless/MedicationRecordList",
    component: MedicationRecordList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MedicationRecordList>;

export const Default: Story = {
    render: () => ({
        template: `<lily-medication-record-list status="none-known" statusLabel="No known medicines"></lily-medication-record-list>`,
    }),
};
