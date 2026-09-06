import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./date-range.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/DateRange",
    render: (args) => h("lily-date-range", args as Record<string, string | boolean>),
    args: {
        "label": "Trip dates",
        "start-label": "Departure",
        "end-label": "Return",
        "start": "2026-06-01",
        "end": "2026-06-10",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
