import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./task-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Review pull requests</li><li>Update documentation</li><li>Deploy to staging</li>";

const meta: Meta = {
    title: "Lists/TaskList",
    render: (args) => h("lily-task-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Today's tasks",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
