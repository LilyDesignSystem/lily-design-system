import type { Meta, StoryObj } from "@storybook/react-vite";
import DeviceRecordList from "./DeviceRecordList";
import DeviceRecordListItem from "./DeviceRecordListItem";

const meta = {
    title: "Headless/DeviceRecordList",
    component: DeviceRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof DeviceRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Medical devices" },
    render: (args) => (
        <DeviceRecordList {...args}>
            <DeviceRecordListItem
                device="Cardiac pacemaker"
                status="active"
                statusLabel="In use"
                timing="2021-02-08"
                timingLabel="Since 8 Feb 2021"
            />
        </DeviceRecordList>
    ),
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known medical devices" },
};
