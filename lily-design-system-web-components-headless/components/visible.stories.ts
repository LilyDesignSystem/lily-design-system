import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./visible.js";
import { h } from "../stories/render.js";

const SLOT = "<p>This content reports its own viewport visibility via data-visible.</p>";

const meta: Meta = {
    title: "Content/Visible",
    render: (args) => h("lily-visible", args as Record<string, string | boolean>, SLOT),
    args: {
        "threshold": "0.5",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
