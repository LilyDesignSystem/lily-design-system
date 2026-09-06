import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./postal-code-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/PostalCodeView",
    render: (args) => h("lily-postal-code-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "text": "SW1A 1AA"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
