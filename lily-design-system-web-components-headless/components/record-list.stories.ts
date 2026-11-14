import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./record-list.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/RecordList",
    render: (args) => h("lily-record-list", args as Record<string, string | boolean>, ""),
    args: { status: "none-known", "status-label": "No vital signs recorded" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
