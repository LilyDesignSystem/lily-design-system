import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-star-rating-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Pickers/FiveStarRatingPickerButton",
    render: (args) => h("lily-five-star-rating-picker-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "3",
        "label": "3 stars"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
