import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hamburger-menu.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Navigation/HamburgerMenu",
    render: (args) => h("lily-hamburger-menu", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Main menu"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
