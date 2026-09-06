import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sparkline.js";
import { h } from "../stories/render.js";

const SLOT = '<svg viewBox="0 0 100 20"><polyline points="0,20 20,10 40,15 60,5 80,12 100,2"></polyline></svg>';

const meta: Meta = {
    title: "Content/Sparkline",
    render: (args) => h("lily-sparkline", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Revenue trend over past 7 days"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
