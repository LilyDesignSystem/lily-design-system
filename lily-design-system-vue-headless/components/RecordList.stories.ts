import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RecordList from "./RecordList.vue";

const meta = {
    title: "Headless/RecordList",
    component: RecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof RecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Vital signs" },
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No vital signs recorded" },
};
