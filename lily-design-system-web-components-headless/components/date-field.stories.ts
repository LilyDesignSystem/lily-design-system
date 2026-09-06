import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./date-field.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/DateField",
    render: (args) => h("lily-date-field", args as Record<string, string | boolean>),
    args: {
        "label": "Start date",
        "description": "Format: YYYY-MM-DD",
        "value": "2026-06-01",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithError: Story = {
    args: {
        "label": "End date",
        "error": "End date is required",
        "required": true,
    },
};
