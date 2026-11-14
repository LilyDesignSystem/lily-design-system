import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ProcedureRecordListItem from "./ProcedureRecordListItem.vue";

const meta = {
    title: "Headless/ProcedureRecordListItem",
    component: ProcedureRecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof ProcedureRecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        procedure: "Appendectomy",
        status: "completed",
        statusLabel: "Completed",
        performed: "2018-04-22",
        performedLabel: "22 Apr 2018",
    },
};
