import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tel-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/TelInput",
    render: (args) => h("lily-tel-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Phone"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
