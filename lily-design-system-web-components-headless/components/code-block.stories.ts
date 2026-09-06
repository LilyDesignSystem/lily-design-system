import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./code-block.js";
import { h } from "../stories/render.js";

const SLOT = "function greet(name) {\n  return `Hello, ${name}!`;\n}";

const meta: Meta = {
    title: "Content/CodeBlock",
    render: (args) => h("lily-code-block", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Example function",
        "line-numbers": true,
        "highlight-lines": "2",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
