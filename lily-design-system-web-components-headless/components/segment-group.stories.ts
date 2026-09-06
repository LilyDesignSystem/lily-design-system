import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./segment-group.js";
import "./segment-group-item.js";
import { h } from "../stories/render.js";

const SLOT =
    '<lily-segment-group-item checked value="day">Day</lily-segment-group-item>' +
    '<lily-segment-group-item value="week">Week</lily-segment-group-item>' +
    '<lily-segment-group-item value="month">Month</lily-segment-group-item>';

const meta: Meta = {
    title: "Forms/SegmentGroup",
    render: (args) => h("lily-segment-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "View",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
