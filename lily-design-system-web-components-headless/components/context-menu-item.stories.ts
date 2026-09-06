import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./context-menu-item.js";
import { h } from "../stories/render.js";

const SLOT = "Cut";

const meta: Meta = {
    title: "Navigation/ContextMenuItem",
    render: (args) => h("lily-context-menu-item", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
