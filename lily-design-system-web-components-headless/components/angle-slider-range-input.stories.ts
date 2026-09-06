import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./angle-slider-range-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/AngleSliderRangeInput",
    render: (args) => h("lily-angle-slider-range-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rotation",
        "value": "90"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
