import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./icon.js";
import { h } from "../stories/render.js";

const SLOT = "x";

const meta: Meta = {
    title: "Content/Icon",
    render: (args) => h("lily-icon", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Close",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Decorative: Story = {
    args: {
        "label": undefined,
        "decorative": true,
    },
};
