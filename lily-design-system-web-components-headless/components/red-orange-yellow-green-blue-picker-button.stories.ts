import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-orange-yellow-green-blue-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Pickers/RedOrangeYellowGreenBluePickerButton",
    render: (args) => h("lily-red-orange-yellow-green-blue-picker-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "yellow",
        "label": "Yellow - Caution"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
