import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-call-error.js";
import { h } from "../stories/render.js";

const SLOT = "Text";

const meta: Meta = {
    title: "Media and data/ToolCallError",
    render: (args) => h("lily-tool-call-error", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "ToolCallError"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
