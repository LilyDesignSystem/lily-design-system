import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./device-record-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/DeviceRecordListItem",
    render: (args) =>
        h("lily-device-record-list-item", args as Record<string, string | boolean>, ""),
    args: {
        device: "Cardiac pacemaker",
        status: "active",
        "status-label": "In use",
        timing: "2021-02-08",
        "timing-label": "Since 8 Feb 2021",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
