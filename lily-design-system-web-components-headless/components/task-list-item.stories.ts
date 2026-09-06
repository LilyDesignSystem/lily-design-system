import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./task-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Lists/TaskListItem",
    render: (args) => {
        const ol = document.createElement("ol");
        ol.className = "task-list";
        ol.appendChild(h("lily-task-list-item", args as Record<string, string | boolean>));
        return ol;
    },
    args: {
        "label": "Review pull request",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
