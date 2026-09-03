import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./alert.js";
import { h } from "../stories/render.js";

const SLOT = "Something went wrong.";

const meta: Meta = {
    title: "Content/Alert",
    render: (args) => h("lily-alert", args as Record<string, string | boolean>, SLOT),
    args: {
        "heading": "Error",
        "type": "error"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
