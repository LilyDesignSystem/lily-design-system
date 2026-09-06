import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./drawer.js";
import { h } from "../stories/render.js";

const SLOT = "<nav>Navigation content goes here.</nav>";

const meta: Meta = {
    title: "Content/Drawer",
    render: (args) => h("lily-drawer", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Navigation",
        "side": "left",
        "open": true,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
