import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./select.js";
import { h } from "../stories/render.js";

const SLOT = '<option value="red">Red</option><option value="green">Green</option><option value="blue">Blue</option>';

const meta: Meta = {
    title: "Forms/Select",
    render: (args) => h("lily-select", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Colour",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
