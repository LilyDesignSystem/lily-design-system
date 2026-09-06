import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./action-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "Delete";

const meta: Meta = {
    title: "Navigation/ActionBarButton",
    render: (args) => h("lily-action-bar-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Delete"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
