import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-call-output.js";
import { h } from "../stories/render.js";

const SLOT = "Text";

const meta: Meta = {
    title: "Media and data/ToolCallOutput",
    render: (args) => h("lily-tool-call-output", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "ToolCallOutput"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
