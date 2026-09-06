import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./header.js";
import { h } from "../stories/render.js";

const SLOT = "<h1>Site title</h1>";

const meta: Meta = {
    title: "Navigation/Header",
    render: (args) => h("lily-header", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Site header"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
