import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./popconfirm-dialog.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/PopconfirmDialog",
    render: (args) => h("lily-popconfirm-dialog", args as Record<string, string | boolean>, SLOT),
    args: {
        open: true,
        title: "Delete this item?",
        description: "This action cannot be undone.",
        "confirm-label": "Delete",
        "cancel-label": "Cancel",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
