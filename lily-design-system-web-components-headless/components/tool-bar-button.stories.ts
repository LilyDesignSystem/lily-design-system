import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "Bold";

const meta: Meta = {
    title: "Navigation/ToolBarButton",
    render: (args) => h("lily-tool-bar-button", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
