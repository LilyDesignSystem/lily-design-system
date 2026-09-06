import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./date-time-now-input.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/DateTimeNowInput",
    render: (args) => h("lily-date-time-now-input", args as Record<string, string | boolean>),
    args: {
        "label": "Event time",
        "date-label": "Date",
        "time-label": "Time",
        "now-label": "Now",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
