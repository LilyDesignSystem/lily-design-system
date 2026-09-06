import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./reset-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/ResetInput",
    render: (args) => h("lily-reset-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "Reset",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
