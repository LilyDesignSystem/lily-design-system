import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./line-chart.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/LineChart",
    render: (args) => h("lily-line-chart", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Temperature over time",
        "series": "[{\"name\":\"Temperature\",\"points\":[{\"x\":0,\"y\":12},{\"x\":1,\"y\":15},{\"x\":2,\"y\":13},{\"x\":3,\"y\":17}]}]"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
