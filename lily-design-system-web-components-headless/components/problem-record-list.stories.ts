import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./problem-record-list.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/ProblemRecordList",
    render: (args) => h("lily-problem-record-list", args as Record<string, string | boolean>, ""),
    args: { status: "none-known", "status-label": "No known problems" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
