import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./range-fieldset.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Forms/RangeFieldset",
    render: (args) => h("lily-range-fieldset", args as Record<string, string | boolean>),
    args: {
        legend: "Price",
        "minimum-label": "Lowest price",
        "maximum-label": "Highest price",
        minimum: "20",
        maximum: "80",
        "minimum-name": "price-min",
        "maximum-name": "price-max",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
