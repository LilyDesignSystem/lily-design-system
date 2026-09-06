import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./button-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/ButtonInput",
    render: (args) => h("lily-button-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "Submit"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
