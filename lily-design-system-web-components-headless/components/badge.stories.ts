import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./badge.js";
import { h } from "../stories/render.js";

const SLOT = "Active";

const meta: Meta = {
    title: "Content/Badge",
    render: (args) => h("lily-badge", args as Record<string, string | boolean>, SLOT),
    args: {
        "type": "success"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
