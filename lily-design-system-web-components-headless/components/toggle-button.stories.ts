import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./toggle-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Buttons and links/ToggleButton",
    render: (args) => h("lily-toggle-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Notifications"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
