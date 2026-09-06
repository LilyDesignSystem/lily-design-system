import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./color-picker.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Pickers/ColorPicker",
    render: (args) => h("lily-color-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Color saturation and brightness",
        "x": "50",
        "y": "50"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
