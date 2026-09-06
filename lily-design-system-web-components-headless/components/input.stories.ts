import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/Input",
    render: (args) => h("lily-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Name"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
