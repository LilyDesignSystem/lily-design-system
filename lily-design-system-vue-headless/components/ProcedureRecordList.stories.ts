import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ProcedureRecordList from "./ProcedureRecordList.vue";

const meta = {
    title: "Headless/ProcedureRecordList",
    component: ProcedureRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof ProcedureRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Procedures" },
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known procedures" },
};
