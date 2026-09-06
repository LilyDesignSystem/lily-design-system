import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./gantt-table.js";
import { h } from "../stories/render.js";

const SLOT =
    '<thead><tr><th>Task</th><th>Week 1</th><th>Week 2</th></tr></thead>' +
    "<tbody><tr><th>Design</th><td>&#8212;</td><td></td></tr></tbody>";

const meta: Meta = {
    title: "Tables/GanttTable",
    render: (args) => h("lily-gantt-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Project timeline"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
