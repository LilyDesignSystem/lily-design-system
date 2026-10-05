import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-call-status.js";
import { h } from "../stories/render.js";

const SLOT = "Text";

const meta: Meta = {
    title: "Media and data/ToolCallStatus",
    render: (args) => h("lily-tool-call-status", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "ToolCallStatus"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
