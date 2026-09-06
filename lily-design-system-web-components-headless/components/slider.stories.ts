import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slider.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/Slider",
    render: (args) => h("lily-slider", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Volume",
        "value": "50",
        "min": "0",
        "max": "100",
        "step": "1"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
