import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./calendar-day-table.js";
import { h } from "../stories/render.js";

const SLOT =
    "<thead><tr><th>Col</th></tr></thead>" +
    "<tbody><tr><td>1</td></tr></tbody>";

const meta: Meta = {
    title: "Tables/CalendarDayTable",
    render: (args) => h("lily-calendar-day-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Monday 6 January 2025"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
