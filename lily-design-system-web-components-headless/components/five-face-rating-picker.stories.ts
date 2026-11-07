import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-face-rating-picker.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Pickers/FiveFaceRatingPicker",
    render: (args) => h("lily-five-face-rating-picker", args as Record<string, string | boolean>),
    args: {
        label: "Rate your visit",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
