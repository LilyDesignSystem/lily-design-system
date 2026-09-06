import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-star-rating-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/FiveStarRatingView",
    render: (args) => h("lily-five-star-rating-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "4",
        "label": "4 out of 5 stars",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
