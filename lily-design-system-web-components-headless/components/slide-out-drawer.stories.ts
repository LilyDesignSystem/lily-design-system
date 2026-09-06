import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slide-out-drawer.js";
import { h } from "../stories/render.js";

const SLOT = "<nav><ul><li><a href=\"/\">Home</a></li></ul></nav>";

const meta: Meta = {
    title: "Content/SlideOutDrawer",
    render: (args) => h("lily-slide-out-drawer", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Navigation menu",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
