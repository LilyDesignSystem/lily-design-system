import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-call-name.js";
import { h } from "../stories/render.js";

const SLOT = "Text";

const meta: Meta = {
    title: "Media and data/ToolCallName",
    render: (args) => h("lily-tool-call-name", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "ToolCallName"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
