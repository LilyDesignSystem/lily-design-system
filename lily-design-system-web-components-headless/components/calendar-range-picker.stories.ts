import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./calendar-range-picker.js";
import { h } from "../stories/render.js";

const SLOT =
    '<table><caption>January 2026</caption><tbody><tr><td><button type="button">1</button></td><td><button type="button">2</button></td></tr></tbody></table>';

const meta: Meta = {
    title: "Pickers/CalendarRangePicker",
    render: (args) => h("lily-calendar-range-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Select travel dates"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
