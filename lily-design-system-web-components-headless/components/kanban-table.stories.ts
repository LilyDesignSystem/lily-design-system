import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./kanban-table.js";
import { h } from "../stories/render.js";

const SLOT =
    '<thead><tr><th>To Do</th><th>In Progress</th><th>Done</th></tr></thead>' +
    "<tbody><tr><td>Task A</td><td>Task B</td><td>Task C</td></tr></tbody>";

const meta: Meta = {
    title: "Tables/KanbanTable",
    render: (args) => h("lily-kanban-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sprint 5 board"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
