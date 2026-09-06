import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./navigation-menu.js";
import { h } from "../stories/render.js";

const SLOT = '<a href="/">Home</a> <a href="/about">About</a> <a href="/contact">Contact</a>';

const meta: Meta = {
    title: "Navigation/NavigationMenu",
    render: (args) => h("lily-navigation-menu", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Main navigation"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
