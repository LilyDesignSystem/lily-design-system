import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sidebar.js";
import { h } from "../stories/render.js";

const SLOT = '<nav><a href="/dashboard">Dashboard</a><a href="/projects">Projects</a><a href="/settings">Settings</a></nav>';

const meta: Meta = {
    title: "Navigation/Sidebar",
    render: (args) => h("lily-sidebar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Navigation"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
