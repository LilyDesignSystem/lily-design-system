import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./summary-list.js";

import { h } from "../stories/render.js";

const SLOT = "<dt>Product</dt><dd>Widget</dd><dt>Quantity</dt><dd>3</dd><dt>Total</dt><dd>$29.97</dd>";

const meta: Meta = {
    title: "Lists/SummaryList",
    render: (args) => h("lily-summary-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Order summary",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
