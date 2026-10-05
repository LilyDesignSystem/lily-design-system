import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./calendar-month-table.js";
import { h } from "../stories/render.js";

const SLOT =
    "<thead><tr><th>Col</th></tr></thead>" +
    "<tbody><tr><td>1</td></tr></tbody>";

const meta: Meta = {
    title: "Tables/CalendarMonthTable",
    render: (args) => h("lily-calendar-month-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "January 2025"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
