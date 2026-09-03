import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./warning-callout.js";
import { h } from "../stories/render.js";

const SLOT = "This action cannot be undone.";

const meta: Meta = {
    title: "Content/WarningCallout",
    render: (args) => h("lily-warning-callout", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Warning"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
