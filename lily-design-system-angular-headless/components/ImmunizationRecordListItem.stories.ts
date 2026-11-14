import type { Meta, StoryObj } from "@storybook/angular";
import { ImmunizationRecordListItem } from "./ImmunizationRecordListItem";

const meta: Meta<ImmunizationRecordListItem> = {
    title: "Headless/ImmunizationRecordListItem",
    component: ImmunizationRecordListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ImmunizationRecordListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-immunization-record-list-item vaccine="MMR vaccine" occurrence="2025-09-12" occurrenceLabel="12 Sep 2025" doseNumberLabel="Dose 2 of 2" status="completed" statusLabel="Given" lotNumber="AB1234"></li></ul>`,
    }),
};
