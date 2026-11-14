import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./device-record-list.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/DeviceRecordList",
    render: (args) => h("lily-device-record-list", args as Record<string, string | boolean>, ""),
    args: { status: "none-known", "status-label": "No known medical devices" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
