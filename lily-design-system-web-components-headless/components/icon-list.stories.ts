import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./icon-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Fast</li><li>Secure</li><li>Accessible</li>";

const meta: Meta = {
    title: "Lists/IconList",
    render: (args) => h("lily-icon-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Features",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
