import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./calendar-table.js";
import { h } from "../stories/render.js";

const SLOT =
    '<thead><tr><th>Sun</th><th>Mon</th><th>Tue</th></tr></thead>' +
    "<tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody>";

const meta: Meta = {
    title: "Tables/CalendarTable",
    render: (args) => h("lily-calendar-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "January 2025"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
