import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./command.js";
import { h } from "../stories/render.js";

const SLOT = '<div role="option">Open file</div><div role="option">Save file</div><div role="option">Close window</div>';

const meta: Meta = {
    title: "Content/Command",
    render: (args) => h("lily-command", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Command palette",
        "placeholder": "Search commands...",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
