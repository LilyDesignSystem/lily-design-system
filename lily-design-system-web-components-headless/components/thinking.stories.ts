import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./thinking.js";
import { h } from "../stories/render.js";

const SLOT = '<p>Reasoning steps.</p>';

const meta: Meta = {
    title: "Content/Thinking",
    render: (args) => h("lily-thinking", args as Record<string, string | boolean>, SLOT),
    args: { "label": "Thinking" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
