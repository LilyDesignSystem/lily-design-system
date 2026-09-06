import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./timeline-list.js";

import { h } from "../stories/render.js";

const SLOT = '<li><time datetime="2024-01-15">January 15, 2024</time> Order placed</li><li><time datetime="2024-01-16">January 16, 2024</time> Order shipped</li>';

const meta: Meta = {
    title: "Lists/TimelineList",
    render: (args) => h("lily-timeline-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Order history",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
