import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./details.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Additional details shown when expanded.</p>";

const meta: Meta = {
    title: "Navigation/Details",
    render: (args) => h("lily-details", args as Record<string, string | boolean>, SLOT),
    args: {
        "summary": "More information"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
