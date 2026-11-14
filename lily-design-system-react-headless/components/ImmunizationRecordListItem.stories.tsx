import type { Meta, StoryObj } from "@storybook/react-vite";
import ImmunizationRecordListItem from "./ImmunizationRecordListItem";

const meta = {
    title: "Headless/ImmunizationRecordListItem",
    component: ImmunizationRecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof ImmunizationRecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        vaccine: "MMR vaccine",
        occurrence: "2025-09-12",
        occurrenceLabel: "12 Sep 2025",
        doseNumberLabel: "Dose 2 of 2",
        status: "completed",
        statusLabel: "Given",
        lotNumber: "AB1234",
    },
    render: (args) => (
        <ul>
            <ImmunizationRecordListItem {...args}></ImmunizationRecordListItem>
        </ul>
    ),
};
