import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./context-menu.js";
import "./context-menu-item.js";
import { h } from "../stories/render.js";

const SLOT =
    "<lily-context-menu-item>Cut</lily-context-menu-item><lily-context-menu-item>Copy</lily-context-menu-item><lily-context-menu-item>Paste</lily-context-menu-item>";

const meta: Meta = {
    title: "Navigation/ContextMenu",
    render: (args) => h("lily-context-menu", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Actions",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
