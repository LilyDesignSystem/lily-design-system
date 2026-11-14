import type { Meta, StoryObj } from "@storybook/angular";
import { ProcedureRecordList } from "./ProcedureRecordList";

const meta: Meta<ProcedureRecordList> = {
    title: "Headless/ProcedureRecordList",
    component: ProcedureRecordList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProcedureRecordList>;

export const Default: Story = {
    render: () => ({
        template: `<lily-procedure-record-list status="none-known" statusLabel="No known procedures"></lily-procedure-record-list>`,
    }),
};
