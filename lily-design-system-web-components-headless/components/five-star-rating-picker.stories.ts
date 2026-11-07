import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-star-rating-picker.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Pickers/FiveStarRatingPicker",
    render: (args) => h("lily-five-star-rating-picker", args as Record<string, string | boolean>),
    args: {
        label: "Rate this product",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
