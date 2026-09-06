import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./scroll-bar.js";
import { h } from "../stories/render.js";

const SLOT = '<div class="scroll-thumb"></div>';

const meta: Meta = {
    title: "Navigation/ScrollBar",
    render: (args) => h("lily-scroll-bar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Chat scroll",
        "orientation": "vertical"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
