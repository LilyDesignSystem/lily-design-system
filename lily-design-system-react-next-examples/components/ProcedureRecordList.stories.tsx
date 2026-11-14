import type { Meta, StoryObj } from "@storybook/react-vite";
import ProcedureRecordList from "./ProcedureRecordList";
import ProcedureRecordListItem from "./ProcedureRecordListItem";

const meta = {
    title: "Headless/ProcedureRecordList",
    component: ProcedureRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof ProcedureRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Procedures" },
    render: (args) => (
        <ProcedureRecordList {...args}>
            <ProcedureRecordListItem
                procedure="Appendectomy"
                status="completed"
                statusLabel="Completed"
                performed="2018-04-22"
                performedLabel="22 Apr 2018"
            />
        </ProcedureRecordList>
    ),
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known procedures" },
};
