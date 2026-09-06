import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./color-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Pickers/ColorPickerButton",
    render: (args) => h("lily-color-picker-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "color": "#dc2626",
        "label": "Red"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
