import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ai-label.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/AiLabel",
    render: (args) => h("lily-ai-label", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "AI-generated summary",
        "text": "AI",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
