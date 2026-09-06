import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-face-rating-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Pickers/FiveFaceRatingPickerButton",
    render: (args) => h("lily-five-face-rating-picker-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "4",
        "label": "Good"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
