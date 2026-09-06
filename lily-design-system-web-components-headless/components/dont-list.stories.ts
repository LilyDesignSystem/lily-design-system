import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./dont-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Skip alt text</li><li>Use only color for meaning</li>";

const meta: Meta = {
    title: "Lists/DontList",
    render: (args) => h("lily-dont-list", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
