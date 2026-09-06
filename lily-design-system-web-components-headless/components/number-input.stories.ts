import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/NumberInput",
    render: (args) => h("lily-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Age",
        "min": "0",
        "max": "120"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
