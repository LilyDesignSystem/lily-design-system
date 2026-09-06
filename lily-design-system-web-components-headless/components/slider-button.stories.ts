import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slider-button.js";
import { h } from "../stories/render.js";

const SLOT = "Slide to confirm";

const meta: Meta = {
    title: "Buttons and links/SliderButton",
    render: (args) => h("lily-slider-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Slide to confirm order"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
