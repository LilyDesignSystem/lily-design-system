import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-call-input.js";
import { h } from "../stories/render.js";

const SLOT = "Text";

const meta: Meta = {
    title: "Media and data/ToolCallInput",
    render: (args) => h("lily-tool-call-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "ToolCallInput"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
