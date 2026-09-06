import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tab-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "General";

const meta: Meta = {
    title: "Navigation/TabBarButton",
    render: (args) => h("lily-tab-bar-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "selected": true,
        "controls": "panel-general"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
