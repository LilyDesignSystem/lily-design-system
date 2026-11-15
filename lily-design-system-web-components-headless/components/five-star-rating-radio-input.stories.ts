import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-star-rating-radio-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/FiveStarRatingRadioInput",
    render: (args) =>
        h("lily-five-star-rating-radio-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Email",
        name: "delivery",
        value: "email",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
