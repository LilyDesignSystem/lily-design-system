import type { Meta, StoryObj } from "@storybook/react-vite";
import ImmunizationRecordList from "./ImmunizationRecordList";
import ImmunizationRecordListItem from "./ImmunizationRecordListItem";

const meta = {
    title: "Headless/ImmunizationRecordList",
    component: ImmunizationRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof ImmunizationRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Immunizations" },
    render: (args) => (
        <ImmunizationRecordList {...args}>
            <ImmunizationRecordListItem
                vaccine="MMR vaccine"
                occurrence="2025-09-12"
                occurrenceLabel="12 Sep 2025"
                doseNumberLabel="Dose 2 of 2"
                status="completed"
                statusLabel="Given"
                lotNumber="AB1234"
            />
        </ImmunizationRecordList>
    ),
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No immunizations recorded" },
};
