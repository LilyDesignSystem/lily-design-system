import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./color-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/ColorInput",
    render: (args) => h("lily-color-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Accent colour",
        "value": "#2563eb"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
