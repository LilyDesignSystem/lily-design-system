import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ProblemRecordList from "./ProblemRecordList.vue";

const meta = {
    title: "Headless/ProblemRecordList",
    component: ProblemRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof ProblemRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Problems" },
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known problems" },
};
