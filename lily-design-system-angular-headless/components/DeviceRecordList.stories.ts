import type { Meta, StoryObj } from "@storybook/angular";
import { DeviceRecordList } from "./DeviceRecordList";

const meta: Meta<DeviceRecordList> = {
    title: "Headless/DeviceRecordList",
    component: DeviceRecordList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DeviceRecordList>;

export const Default: Story = {
    render: () => ({
        template: `<lily-device-record-list status="none-known" statusLabel="No known medical devices"></lily-device-record-list>`,
    }),
};
