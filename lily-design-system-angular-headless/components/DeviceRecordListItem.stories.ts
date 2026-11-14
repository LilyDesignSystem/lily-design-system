import type { Meta, StoryObj } from "@storybook/angular";
import { DeviceRecordListItem } from "./DeviceRecordListItem";

const meta: Meta<DeviceRecordListItem> = {
    title: "Headless/DeviceRecordListItem",
    component: DeviceRecordListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DeviceRecordListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-device-record-list-item device="Cardiac pacemaker" status="active" statusLabel="In use" timing="2021-02-08" timingLabel="Since 8 Feb 2021"></li></ul>`,
    }),
};
