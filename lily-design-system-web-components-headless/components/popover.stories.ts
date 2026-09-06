import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./popover.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Here is some contextual information.</p>";

const meta: Meta = {
    title: "Content/Popover",
    render: (args) => h("lily-popover", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Additional information",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
