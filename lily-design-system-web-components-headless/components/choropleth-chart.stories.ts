import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./choropleth-chart.js";
import { h } from "../stories/render.js";

const SLOT = '<svg viewBox="0 0 10 10" width="120" height="120"><circle cx="5" cy="5" r="4"></circle></svg>';

const meta: Meta = {
    title: "Media and data/ChoroplethChart",
    render: (args) => h("lily-choropleth-chart", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "ChoroplethChart"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
