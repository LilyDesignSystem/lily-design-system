import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul\n  class="device-record-list"\n  data-status="known"\n  aria-label="Medical devices"\n>\n  <li\n    class="device-record-list-item"\n    data-status="active"\n  >\n    <span class="device-record-list-item-device">Cardiac pacemaker</span>\n    <span class="device-record-list-item-status">In use</span>\n    <time\n      class="device-record-list-item-timing"\n      datetime="2021-02-08"\n      >Since 8 Feb 2021</time\n    >\n  </li>\n</ul>';

const meta = {
    title: "Headless/Device Record List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
