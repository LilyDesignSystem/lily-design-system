import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<ul class="device-record-list" data-status="known" aria-label="Medical devices"><li class="device-record-list-item" data-status="active"><span class="device-record-list-item-device">Cardiac pacemaker</span> <span class="device-record-list-item-status">In use</span> <time class="device-record-list-item-timing" datetime="2021-02-08">Since 8 Feb 2021</time></li></ul>`;

const meta = {
    title: "Headless/DeviceRecordListItem",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
