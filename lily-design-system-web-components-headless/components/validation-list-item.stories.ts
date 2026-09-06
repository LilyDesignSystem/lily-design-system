import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./validation-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "At least 8 characters";

const meta: Meta = {
    title: "Lists/ValidationListItem",
    render: (args) => {
        const ul = document.createElement("ul");
        ul.className = "validation-list";
        ul.appendChild(h("lily-validation-list-item", args as Record<string, string | boolean>, SLOT));
        return ul;
    },
    args: {
        "status": "passed",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
