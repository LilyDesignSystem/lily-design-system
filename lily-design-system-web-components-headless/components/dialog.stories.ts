import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./dialog.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Dialog content.</p>";

const meta: Meta = {
    title: "Overlays/Dialog",
    render: (args) => h("lily-dialog", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Settings",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
