import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./menu-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "File";

const meta: Meta = {
    title: "Navigation/MenuBarButton",
    render: (args) => h("lily-menu-bar-button", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
