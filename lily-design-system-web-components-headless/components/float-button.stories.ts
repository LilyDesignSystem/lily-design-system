import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./float-button.js";
import { h } from "../stories/render.js";

const SLOT = "+";

const meta: Meta = {
    title: "Buttons and links/FloatButton",
    render: (args) => h("lily-float-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Add item"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
