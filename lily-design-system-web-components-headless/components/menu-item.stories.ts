import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./menu-item.js";
import { h } from "../stories/render.js";

const SLOT = "New File";

const meta: Meta = {
    title: "Navigation/MenuItem",
    render: (args) => h("lily-menu-item", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
