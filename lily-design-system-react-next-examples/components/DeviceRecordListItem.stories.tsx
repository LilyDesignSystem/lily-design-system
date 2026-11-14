import type { Meta, StoryObj } from "@storybook/react-vite";
import DeviceRecordListItem from "./DeviceRecordListItem";

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
    render: (args) => (
        <ul>
            <DeviceRecordListItem {...args}></DeviceRecordListItem>
        </ul>
    ),
};
