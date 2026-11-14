import type { Meta, StoryObj } from "@storybook/vue3-vite";
import DeviceRecordListItem from "./DeviceRecordListItem.vue";

const meta = {
    title: "Headless/DeviceRecordListItem",
    component: DeviceRecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof DeviceRecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        device: "Cardiac pacemaker",
        status: "active",
        statusLabel: "In use",
        timing: "2021-02-08",
        timingLabel: "Since 8 Feb 2021",
    },
};
