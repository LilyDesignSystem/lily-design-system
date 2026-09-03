import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./icon-button.js";
import { h } from "../stories/render.js";

const SLOT = "<span aria-hidden=\"true\">&times;</span>";

const meta: Meta = {
    title: "Buttons and links/IconButton",
    render: (args) => h("lily-icon-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Close"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
