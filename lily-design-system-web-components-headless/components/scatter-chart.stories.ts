import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./scatter-chart.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/ScatterChart",
    render: (args) => h("lily-scatter-chart", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Heights vs weights",
        "series": "[{\"name\":\"Sample\",\"points\":[{\"x\":1,\"y\":2},{\"x\":2,\"y\":4},{\"x\":3,\"y\":3},{\"x\":4,\"y\":5}]}]"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
