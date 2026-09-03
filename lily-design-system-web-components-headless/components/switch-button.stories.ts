import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./switch-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Buttons and links/SwitchButton",
    render: (args) => h("lily-switch-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Dark mode"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
