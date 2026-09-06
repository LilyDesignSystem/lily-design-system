import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./floating-panel.js";
import { h } from "../stories/render.js";

const SLOT = "<h3>Support chat</h3><p>How can we help?</p>";

const meta: Meta = {
    title: "Content/FloatingPanel",
    render: (args) => h("lily-floating-panel", args as Record<string, string | boolean>, SLOT),
    args: {
        "open": true,
        "label": "Live chat",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Closed: Story = {
    args: {
        "open": false,
    },
};
