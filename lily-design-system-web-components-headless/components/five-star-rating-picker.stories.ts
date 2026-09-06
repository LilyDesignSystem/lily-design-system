import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-star-rating-picker.js";
import "./five-star-rating-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"]
    .map((label, i) => `<lily-five-star-rating-picker-button value="${i + 1}" label="${label}"></lily-five-star-rating-picker-button>`)
    .join("");

const meta: Meta = {
    title: "Pickers/FiveStarRatingPicker",
    render: (args) => h("lily-five-star-rating-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rate this product"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
