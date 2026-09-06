import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./search-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/SearchInput",
    render: (args) => h("lily-search-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Search",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
