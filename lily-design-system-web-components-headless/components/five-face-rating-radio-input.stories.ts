import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-face-rating-radio-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/FiveFaceRatingRadioInput",
    render: (args) =>
        h("lily-five-face-rating-radio-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Email",
        name: "delivery",
        value: "email",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
