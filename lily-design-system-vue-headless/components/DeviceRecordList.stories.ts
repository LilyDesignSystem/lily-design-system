import type { Meta, StoryObj } from "@storybook/vue3-vite";
import DeviceRecordList from "./DeviceRecordList.vue";

const meta = {
    title: "Headless/DeviceRecordList",
    component: DeviceRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof DeviceRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Medical devices" },
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known medical devices" },
};
