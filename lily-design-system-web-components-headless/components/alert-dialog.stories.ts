import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./alert-dialog.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Overlays/AlertDialog",
    render: (args) => h("lily-alert-dialog", args as Record<string, string | boolean>, SLOT),
    args: {
        "title": "Delete item",
        "description": "This cannot be undone.",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
