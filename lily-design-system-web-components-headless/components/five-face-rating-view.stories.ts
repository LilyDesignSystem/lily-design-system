import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-face-rating-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/FiveFaceRatingView",
    render: (args) => h("lily-five-face-rating-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "4",
        "label": "Patient satisfaction: Good",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
