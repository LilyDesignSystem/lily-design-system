import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./checkbox-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/CheckboxInput",
    render: (args) => h("lily-checkbox-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Subscribe to newsletter"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
