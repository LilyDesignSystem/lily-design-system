import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./range-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/RangeInput",
    render: (args) => h("lily-range-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Volume",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
