import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tooltip.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/Tooltip",
    render: (args) => h("lily-tooltip", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Additional info",
        "visible": true,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
