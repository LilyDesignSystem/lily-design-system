import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-amber-green-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Pickers/RedAmberGreenPickerButton",
    render: (args) => h("lily-red-amber-green-picker-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "amber",
        "label": "Amber - Caution"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
