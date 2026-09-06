import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tour-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Welcome to the app!</p>";

const meta: Meta = {
    title: "Lists/TourListItem",
    render: (args) => {
        const ol = document.createElement("ol");
        ol.className = "tour-list";
        ol.appendChild(h("lily-tour-list-item", args as Record<string, string | boolean>, SLOT));
        return ol;
    },
    args: {
        "label": "Welcome",
        "current": true,
        "step-number": "1",
        "total-steps": "3",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
