import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./numeric-rating-scale-picker.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Healthcare/NumericRatingScalePicker",
    render: (args) =>
        h("lily-numeric-rating-scale-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "How bad is your pain now?",
        "min-label": "No pain",
        "max-label": "Worst pain imaginable",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
