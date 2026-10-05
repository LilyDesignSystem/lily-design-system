import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-call.js";
import { h } from "../stories/render.js";

const SLOT = '<span slot="summary">search_web</span>Body';

const meta: Meta = {
    title: "Media and data/ToolCall",
    render: (args) => h("lily-tool-call", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "ToolCall"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
