import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-face-rating-picker.js";
import "./five-face-rating-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = [
    ["1", "Very bad"],
    ["2", "Bad"],
    ["3", "Okay"],
    ["4", "Good"],
    ["5", "Very good"],
]
    .map(([value, label]) => `<lily-five-face-rating-picker-button value="${value}" label="${label}"></lily-five-face-rating-picker-button>`)
    .join("");

const meta: Meta = {
    title: "Pickers/FiveFaceRatingPicker",
    render: (args) => h("lily-five-face-rating-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rate your visit"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
