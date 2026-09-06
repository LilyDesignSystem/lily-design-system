import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./segment-group-item.js";
import { h } from "../stories/render.js";

const SLOT = "Day";

const meta: Meta = {
    title: "Forms/SegmentGroupItem",
    render: (args) => h("lily-segment-group-item", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "day",
        "checked": true,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
