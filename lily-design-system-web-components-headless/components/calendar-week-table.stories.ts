import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./calendar-week-table.js";
import { h } from "../stories/render.js";

const SLOT =
    "<thead><tr><th>Col</th></tr></thead>" +
    "<tbody><tr><td>1</td></tr></tbody>";

const meta: Meta = {
    title: "Tables/CalendarWeekTable",
    render: (args) => h("lily-calendar-week-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Week of 6 January 2025"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
