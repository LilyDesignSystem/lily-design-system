import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./text-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/TextInput",
    render: (args) => h("lily-text-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Name"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
