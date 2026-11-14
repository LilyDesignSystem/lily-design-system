import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./procedure-record-list.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/ProcedureRecordList",
    render: (args) => h("lily-procedure-record-list", args as Record<string, string | boolean>, ""),
    args: { status: "none-known", "status-label": "No known procedures" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
