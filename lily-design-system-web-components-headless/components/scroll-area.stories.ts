import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./scroll-area.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Long content...</p>".repeat(10);

const meta: Meta = {
    title: "Content/ScrollArea",
    render: (args) => h("lily-scroll-area", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Scrollable content"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
