import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./postal-code-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/PostalCodeInput",
    render: (args) => h("lily-postal-code-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Postal code"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
