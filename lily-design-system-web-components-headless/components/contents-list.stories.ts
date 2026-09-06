import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./contents-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li><a href=\"#introduction\">Introduction</a></li><li><a href=\"#usage\">Usage</a></li>";

const meta: Meta = {
    title: "Lists/ContentsList",
    render: (args) => h("lily-contents-list", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
