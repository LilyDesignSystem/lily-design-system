import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hidden-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/HiddenInput",
    render: (args) => h("lily-hidden-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "name": "csrf-token",
        "value": "abc123"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
