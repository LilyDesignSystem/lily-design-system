import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./bar-chart.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/BarChart",
    render: (args) => h("lily-bar-chart", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sales by day",
        "categories": "[{\"label\":\"Mon\",\"value\":4},{\"label\":\"Tue\",\"value\":9},{\"label\":\"Wed\",\"value\":6}]"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
