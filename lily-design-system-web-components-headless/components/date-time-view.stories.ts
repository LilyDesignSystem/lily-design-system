import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./date-time-view.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/DateTimeView",
    render: (args) => h("lily-date-time-view", args as Record<string, string | boolean>),
    args: {
        "value": "2026-04-27T09:00:00Z",
        "format": "27 April 2026, 09:00",
        "label": "Published",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
