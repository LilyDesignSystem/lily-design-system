import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./dial.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/Dial",
    render: (args) => h("lily-dial", args as Record<string, string | boolean>),
    args: {
        "label": "Volume",
        "value": "50",
        "min": "0",
        "max": "100",
        "step": "1",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
