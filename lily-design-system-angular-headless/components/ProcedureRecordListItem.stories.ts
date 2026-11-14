import type { Meta, StoryObj } from "@storybook/angular";
import { ProcedureRecordListItem } from "./ProcedureRecordListItem";

const meta: Meta<ProcedureRecordListItem> = {
    title: "Headless/ProcedureRecordListItem",
    component: ProcedureRecordListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProcedureRecordListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-procedure-record-list-item procedure="Appendectomy" status="completed" statusLabel="Completed" performed="2018-04-22" performedLabel="22 Apr 2018"></li></ul>`,
    }),
};
