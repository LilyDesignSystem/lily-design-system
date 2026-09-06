import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./collapsible.js";
import { h } from "../stories/render.js";

const SLOT = "Advanced configuration options go here.";

const meta: Meta = {
    title: "Content/Collapsible",
    render: (args) => h("lily-collapsible", args as Record<string, string | boolean>, SLOT),
    args: {
        "summary": "Advanced settings",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
