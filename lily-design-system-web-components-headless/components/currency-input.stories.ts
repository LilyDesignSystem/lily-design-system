import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./currency-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/CurrencyInput",
    render: (args) => h("lily-currency-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Price",
        "currency-code": "USD",
        "value": "19.99"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
