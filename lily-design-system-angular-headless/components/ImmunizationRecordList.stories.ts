import type { Meta, StoryObj } from "@storybook/angular";
import { ImmunizationRecordList } from "./ImmunizationRecordList";

const meta: Meta<ImmunizationRecordList> = {
    title: "Headless/ImmunizationRecordList",
    component: ImmunizationRecordList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ImmunizationRecordList>;

export const Default: Story = {
    render: () => ({
        template: `<lily-immunization-record-list status="none-known" statusLabel="No immunizations recorded"></lily-immunization-record-list>`,
    }),
};
