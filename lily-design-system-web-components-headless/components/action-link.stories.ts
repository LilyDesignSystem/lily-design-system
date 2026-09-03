import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./action-link.js";
import { h } from "../stories/render.js";

const SLOT = "Settings";

const meta: Meta = {
    title: "Buttons and links/ActionLink",
    render: (args) => h("lily-action-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "/settings"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
