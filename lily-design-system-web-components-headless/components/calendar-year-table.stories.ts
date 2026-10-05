import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./calendar-year-table.js";
import { h } from "../stories/render.js";

const SLOT =
    "<thead><tr><th>Col</th></tr></thead>" +
    "<tbody><tr><td>1</td></tr></tbody>";

const meta: Meta = {
    title: "Tables/CalendarYearTable",
    render: (args) => h("lily-calendar-year-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "2025"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
