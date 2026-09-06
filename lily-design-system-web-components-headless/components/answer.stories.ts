import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./answer.js";
import { h } from "../stories/render.js";

const SLOT = "The answer is 42.";

const meta: Meta = {
    title: "Content/Answer",
    render: (args) => h("lily-answer", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Answer",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
