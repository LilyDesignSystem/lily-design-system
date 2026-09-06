import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./step-list.js";

import { h } from "../stories/render.js";

const SLOT = '<li data-status="finished">Cart</li><li data-status="in-progress" aria-current="step">Shipping</li><li data-status="waiting">Payment</li>';

const meta: Meta = {
    title: "Lists/StepList",
    render: (args) => h("lily-step-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Checkout",
        "current": "1",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
