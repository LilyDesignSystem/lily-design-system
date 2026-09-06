import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./text-input-with-search.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/TextInputWithSearch",
    render: (args) => h("lily-text-input-with-search", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Site search",
        "input-label": "Search",
        "search-label": "Search",
        "placeholder": "Search the site…",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
