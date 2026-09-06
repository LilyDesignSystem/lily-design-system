import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./timeline-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "Order placed";

const meta: Meta = {
    title: "Lists/TimelineListItem",
    render: (args) => {
        const ol = document.createElement("ol");
        ol.className = "timeline-list";
        ol.appendChild(h("lily-timeline-list-item", args as Record<string, string | boolean>, SLOT));
        return ol;
    },
    args: {
        "datetime": "2024-01-15",
        "heading": "January 15, 2024",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
