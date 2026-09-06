import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./radio-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/RadioInput",
    render: (args) => h("lily-radio-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Email",
        "name": "delivery",
        "value": "email"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
