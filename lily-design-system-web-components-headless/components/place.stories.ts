import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./place.js";
import { h } from "../stories/render.js";

const SLOT = "<h2>Grand Canyon</h2><p>A steep-sided canyon in Arizona, USA.</p>";

const meta: Meta = {
    title: "Navigation/Place",
    render: (args) => h("lily-place", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Grand Canyon"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
