import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./do-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Write clear labels</li><li>Use semantic HTML</li>";

const meta: Meta = {
    title: "Lists/DoList",
    render: (args) => h("lily-do-list", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
