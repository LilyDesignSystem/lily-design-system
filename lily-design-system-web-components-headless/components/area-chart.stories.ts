import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./area-chart.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/AreaChart",
    render: (args) => h("lily-area-chart", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Visitors over time",
        "series": "[{\"name\":\"Visitors\",\"points\":[{\"x\":0,\"y\":1},{\"x\":1,\"y\":3},{\"x\":2,\"y\":2},{\"x\":3,\"y\":4}]}]"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
