import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./address-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/AddressInput",
    render: (args) => h("lily-address-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Delivery address"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
