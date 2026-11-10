import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./date-field.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/DateField",
    render: (args) => h("lily-date-field", args as Record<string, string | boolean>),
    args: {
        label: "Date of birth",
        "day-label": "Day",
        "month-label": "Month",
        "year-label": "Year",
        order: "dmy",
        description: "For example, 27 3 2007",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithError: Story = {
    args: {
        label: "End date",
        error: "End date is required",
        required: true,
    },
};
