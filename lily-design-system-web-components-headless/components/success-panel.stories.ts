import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./success-panel.js";
import { h } from "../stories/render.js";

const SLOT = "<h1>Application complete</h1><p>Your reference number is ABC123.</p>";

const meta: Meta = {
    title: "Content/SuccessPanel",
    render: (args) => h("lily-success-panel", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Application complete",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
